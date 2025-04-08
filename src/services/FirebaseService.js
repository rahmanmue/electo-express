import { bucket } from "../config/firebase-admin.js";
import InvariantError from "../exceptions/InvariantError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import logger from "../utils/logger.js";

const path = "avatar-electo";

export const uploadAvatar = async (file) => {
  try {
    const safeFileName = encodeURIComponent(file.originalname);
    const fileName = `${path}/${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}-${safeFileName}`;
    const fileRef = bucket.file(fileName);

    // Mengunggah file ke Firebase Storage
    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype, // Tentukan jenis konten file
      },
    });

    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-09-2027", // Tentukan masa berlaku (misalnya 1 tahun)
    });

    logger.info(`success save image ${fileName} to firebase`);

    return url;
  } catch (error) {
    throw new InvariantError("Failed to upload file: " + error.message);
  }
};

export const deleteAvatar = async (downloadURL) => {
  try {
    const storagePath = extractPathFromSignedUrl(downloadURL);
    const file = bucket.file(storagePath);

    // Pengecekan apakah file ada
    const [exists] = await file.exists();
    if (!exists) {
      throw new NotFoundError("File does not exist");
    }

    // Hapus file jika ada
    await file.delete();
    logger.info(`success deleted image ${storagePath}`);
  } catch (error) {
    throw new InvariantError("Failed to delete file: " + error.message);
  }
};

const extractPathFromSignedUrl = (url) => {
  const baseUrl =
    "https://storage.googleapis.com/final-project-fullstack.appspot.com/";

  if (!url.startsWith(baseUrl)) {
    throw new InvariantError("Invalid Firebase Storage URL");
  }

  return url.replace(baseUrl, "").split("?")[0];
};
