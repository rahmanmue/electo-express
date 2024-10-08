import multer from "multer";
import { fileFilter } from "./uploadExcelMiddleware.js";

export const uploadAvatarMemory = multer({ storage: multer.memoryStorage() });
export const uploadExcelMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});
