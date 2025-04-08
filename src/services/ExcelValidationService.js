import XLSX from "xlsx";
import { expectedColumns } from "../config/excelConfig.js";
import InvariantError from "../exceptions/InvariantError.js";
import logger from "../utils/logger.js";

export const validateExcelFile = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // console.log(JSON.stringify(jsonData));

  if (jsonData.length == 0) throw new Error("File is empty");

  const headers = jsonData[0];

  // Check if all expected columns are present
  for (const column of expectedColumns) {
    if (!headers.includes(column.name)) {
      throw new InvariantError(`Missing expected column: ${column.name}`);
    }
  }

  // Validate data types
  for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
    const row = jsonData[rowIndex];
    for (const column of expectedColumns) {
      const columnIndex = headers.indexOf(column.name);
      const cellValue = row[columnIndex];

      if (column.type === "number" && isNaN(cellValue)) {
        throw new InvariantError(
          `Invalid data type in column: ${column.name} at row: ${rowIndex + 1}`
        );
      }
    }
  }

  return XLSX.utils.sheet_to_json(sheet);
};

export const validateExcel = (file) => {
  const fileBuffer = file.buffer;
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // console.log(JSON.stringify(jsonData));

  if (jsonData.length == 0) throw new Error("File is empty");

  const headers = jsonData[0];

  // Check if all expected columns are present
  for (const column of expectedColumns) {
    if (!headers.includes(column.name)) {
      throw new InvariantError(`Missing expected column: ${column.name}`);
    }
  }

  // Validate data types
  for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
    const row = jsonData[rowIndex];
    for (const column of expectedColumns) {
      const columnIndex = headers.indexOf(column.name);
      const cellValue = row[columnIndex];

      if (column.type === "number" && isNaN(cellValue)) {
        throw new InvariantError(
          `Invalid data type in column: ${column.name} at row: ${rowIndex + 1}`
        );
      }
    }
  }

  logger.info("success validate excel file");

  return XLSX.utils.sheet_to_json(sheet);
};
