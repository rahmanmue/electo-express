import { Op } from "sequelize";
import Parpol from "../models/ParpolModel.js";
import XLSX from "xlsx";

export const findAllParpol = async (page = 1, pageSize = 5) => {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const parpol = await Parpol.findAll({
    attributes: ["id", "name"],
    offset: offset,
    limit: limit,
  });

  const totalItems = await Parpol.count();

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
  return {
    status: 200,
    data: parpol,
  };
};

export const saveParpol = async (data) => {
  await Parpol.create(data);
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
          [Op.like]: `%${keyword}%`,
        },
      },
    },
  };

  const parpol = await Parpol.findAll(query);
  const totalItems = await Parpol.count({ where: query.where });

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
  await Parpol.update(data, { where: { id: data.id } });
  return {
    status: 200,
    message: "Data successfully updated",
  };
};

export const deleteParpol = async (id) => {
  await Parpol.destroy({ where: { id: id } });
  return {
    status: 204,
    message: "Data successfully deleted",
  };
};

export const jsonToExcelParpol = async () => {
  const parpol = await Parpol.findAll({
    attributes: [["name", "nama_parpol"]],
  });

  console.log(JSON.stringify(parpol));

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

  return excelBuffer;
};
