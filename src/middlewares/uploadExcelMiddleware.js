import multer from "multer";
import path from "path";
import InvariantError from "../exceptions/InvariantError.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), process.env.UPLOAD_DIR));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/wps-office.xlsx",
    "Excel.application/wps-office.xlsx",
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(
    new InvariantError(
      "Error: File upload only supports the following filetypes - " +
        allowedFileTypes
    )
  );
};

const uploadExcel = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

export default uploadExcel;
