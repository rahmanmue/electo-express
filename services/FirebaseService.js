import { bucket } from "../config/firebase-admin.js";
import { getStorage } from "firebase-admin/storage";

const path = "avatar-electo";

export const uploadAvatar = async (file) => {
  try {
    const fileName = `${path}/${file.originalname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;
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

    return url;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteAvatar = async (downloadURL) => {
  try {
    const storagePath = extractPathFromSignedUrl(downloadURL);
    const bucket = getStorage().bucket();
    const file = bucket.file(storagePath);

    // Pengecekan apakah file ada
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("File does not exist");
    }

    // Hapus file jika ada
    await file.delete();
    console.log(`File deleted successfully: ${storagePath}`);
  } catch (error) {
    throw new Error("Failed to delete file: " + error.message);
  }
};

const extractPathFromSignedUrl = (url) => {
  const baseUrl =
    "https://storage.googleapis.com/final-project-fullstack.appspot.com/";
  const path = url.replace(baseUrl, "").split("?")[0];
  return path;
};
