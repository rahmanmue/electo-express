import SuaraParpol from "../models/SuaraParpolModel.js";
import path from "path";
import { validateExcelFile } from "./ExcelValidationService.js";
import fs from "fs";

export const saveFromExcel = async (data) => {
  try {
    const filePath = path.join(
      process.cwd(),
      process.env.UPLOAD_DIR,
      data.fileName
    );
    const tempData = validateExcelFile(filePath);
    const objData = tempData.map((item) => {
      return {
        ...item,
        daerah_pemilihan_id: data.id_dapil,
      };
    });

    await SuaraParpol.bulkCreate(objData);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return {
      status: 201,
      message: "Data successfully created",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findAllVoteByDapil = async (idDapil) => {
  const suaraParpol = await SuaraParpol.findAll({
    attributes: ["id", "nama_parpol", "total_suara_sah"],
    where: {
      daerah_pemilihan_id: idDapil,
    },
  });

  return {
    status: 200,
    data: suaraParpol,
  };
};

export const findVoteById = async (idVote) => {
  const suaraParpol = await SuaraParpol.findOne({
    attributes: ["id", "nama_parpol", "total_suara_sah"],
    where: {
      id: idVote,
    },
  });

  return {
    status: 200,
    data: suaraParpol,
  };
};

export const saveBulkVote = async (data) => {
  await SuaraParpol.bulkCreate(data);
  return {
    status: 201,
    message: "Data successfully created",
  };
};

export const updateVote = async (idVote, data) => {
  await SuaraParpol.update(data, { where: { id: idVote } });
  return {
    status: 200,
    message: "Data successfully updated",
  };
};

export const deleteVote = async (idVote) => {
  await SuaraParpol.destroy({ where: { id: idVote } });
  return {
    status: 204,
    message: "Data successfully deleted",
  };
};
