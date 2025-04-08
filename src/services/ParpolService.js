import { Op } from "sequelize";
import Parpol from "../models/ParpolModel.js";
import XLSX from "xlsx";
import NotFoundError from "../exceptions/NotFoundError.js";
import InvariantError from "../exceptions/InvariantError.js";
import logger from "../utils/logger.js";

export const findAllParpol = async (page = 1, pageSize = 5) => {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const parpol = await Parpol.findAll({
    attributes: ["id", "name"],
    offset: offset,
    limit: limit,
  });

  const totalItems = await Parpol.count();

  logger.info("success get all parpol");

  return {
    status: 200,
    data: parpol,
    currentPage: page,
    pageSize: pageSize,
    totalItems: totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
  };
};

export const findParpolById = async (id) => {
  const parpol = await Parpol.findOne({
    attributes: ["id", "name"],
    where: { id: id },
  });

  if (!parpol) throw new NotFoundError("Parpol not found");

  logger.info("success get parpol by id");

  return {
    status: 200,
    data: parpol,
  };
};

export const saveParpol = async (data) => {
  const parpol = await Parpol.create(data);

  if (!parpol) throw new InvariantError("Failed created parpol");

  logger.info("success created parpol");

  return {
    status: 201,
    message: "Data successfully created",
  };
};

export const filterParpolByKeyword = async (
  keyword,
  page = 1,
  pageSize = 5
) => {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const query = {
    attributes: ["id", "name"],
    offset: offset,
    limit: limit,
    where: {
      [Op.or]: {
        name: {
          [Op.iLike]: `%${keyword}%`,
        },
      },
    },
  };

  const parpol = await Parpol.findAll(query);
  const totalItems = await Parpol.count({ where: query.where });

  logger.info("success get parpol by keyword");

  return {
    status: 200,
    data: parpol,
    currentPage: page,
    pageSize: pageSize,
    totalItems: totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
  };
};

export const updateParpol = async (data) => {
  const parpol = await Parpol.findOne({
    where: {
      id: data.id,
    },
  });

  if (!parpol) throw new NotFoundError("Parpol not found");

  await parpol.update(data);

  logger.info("success updated parpol");

  return {
    status: 200,
    message: "Data successfully updated",
  };
};

export const deleteParpol = async (id) => {
  const parpol = await Parpol.findOne({
    where: {
      id: id,
    },
  });

  if (!parpol) throw new NotFoundError("Parpol not found");

  await parpol.destroy();

  logger.info("success deleted parpol");

  return {
    status: 204,
    message: "Data successfully deleted",
  };
};

export const jsonToExcelParpol = async () => {
  const parpol = await Parpol.findAll({
    attributes: [["name", "nama_parpol"]],
  });

  const excelHeader = [["nama_parpol", "total_suara_sah"]];
  const worksheet = XLSX.utils.json_to_sheet(
    parpol.map((item) => ({
      nama_parpol: item.dataValues.nama_parpol,
      total_suara_sah: 0,
    }))
  );
  XLSX.utils.sheet_add_aoa(worksheet, excelHeader, { origin: "A1" });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Parpol Vote");

  const excelBuffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
    compression: true,
  });

  logger.info("success created excel file parpol");

  return excelBuffer;
};
