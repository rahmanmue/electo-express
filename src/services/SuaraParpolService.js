import SuaraParpol from "../models/SuaraParpolModel.js";
import path from "path";
import { validateExcelFile, validateExcel } from "./ExcelValidationService.js";
import Parpol from "../models/ParpolModel.js";
import fs from "fs";
import NotFoundError from "../exceptions/NotFoundError.js";
import InvariantError from "../exceptions/InvariantError.js";
import logger from "../utils/logger.js";

export const saveExcel = async (data) => {
  const parpol = await Parpol.findAll({
    attributes: ["name"],
  });

  const filteredParpol = parpol.map((item) => item.name);

  const tempData = validateExcel(data.file);
  const objData = tempData
    .map((item) => {
      if (filteredParpol.includes(item.nama_parpol)) {
        return {
          ...item,
          daerah_pemilihan_id: data.id_dapil,
        };
      }
    })
    .filter((item) => item != null);

  const result = await SuaraParpol.bulkCreate(objData);

  if (result.length === 0)
    throw new InvariantError("Failed to created Suara Parpol");

  logger.info("success created suara parpol");

  return {
    status: 201,
    message: "Data successfully created",
  };
};

export const saveFromExcel = async (data) => {
  const parpol = await Parpol.findAll({
    attributes: ["name"],
  });

  const filteredParpol = parpol.map((item) => item.name);

  const filePath = path.join(
    process.cwd(),
    process.env.UPLOAD_DIR,
    data.fileName
  );
  const tempData = validateExcelFile(filePath);
  const objData = tempData
    .map((item) => {
      if (filteredParpol.includes(item.nama_parpol)) {
        return {
          ...item,
          daerah_pemilihan_id: data.id_dapil,
        };
      }
    })
    .filter((item) => item != null);

  const result = await SuaraParpol.bulkCreate(objData);

  if (result.length === 0)
    throw new InvariantError("Failed to created Suara Parpol");

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  return {
    status: 201,
    message: "Data successfully created",
  };
};

export const findAllVoteByDapil = async (idDapil) => {
  const suaraParpol = await SuaraParpol.findAll({
    attributes: ["id", "nama_parpol", "total_suara_sah"],
    where: {
      daerah_pemilihan_id: idDapil,
    },
  });

  if (!suaraParpol) throw new NotFoundError("Suara Parpol not found");

  logger.info("success get suara parpol by dapil");

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

  if (!suaraParpol) throw new NotFoundError("Suara Parpol not found");

  logger.info("success get suara parpol by id");

  return {
    status: 200,
    data: suaraParpol,
  };
};

export const saveBulkVote = async (data) => {
  const result = await SuaraParpol.bulkCreate(data);

  if (result.length === 0)
    throw new InvariantError("Failed to created Suara Parpol");

  logger.info("success created suara parpol");

  return {
    status: 201,
    message: "Data successfully created",
  };
};

export const updateVote = async (idVote, data) => {
  const suaraParpol = await SuaraParpol.findOne({
    where: {
      id: idVote,
    },
  });

  if (!suaraParpol) throw new NotFoundError("Suara Parpol not found");

  await suaraParpol.update(data);

  logger.info("success updated suara parpol");

  return {
    status: 200,
    message: "Data successfully updated",
  };
};

export const deleteVote = async (idVote) => {
  const suaraParpol = await SuaraParpol.findOne({
    where: {
      id: idVote,
    },
  });

  if (!suaraParpol) throw new NotFoundError("Suara Parpol not found");

  await suaraParpol.destroy();

  logger.info("success deleted suara parpol");

  return {
    status: 204,
    message: "Data successfully deleted",
  };
};
