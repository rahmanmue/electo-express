import Dapil from "../models/DapilModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import InvariantError from "../exceptions/InvariantError.js";
import AuthenticationError from "../exceptions/AuthenthicationError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import logger from "../utils/logger.js";

export const findAllDapil = async () => {
  const data = await Dapil.findAll({
    attributes: [
      "id",
      "daerah_pemilihan",
      "kabupaten_kota",
      "provinsi",
      "tahun",
    ],
  });

  const dapils = data.map((dapil) => {
    return {
      value: dapil.id,
      item: `[${dapil.provinsi}]-[${dapil.kabupaten_kota}]-[${dapil.daerah_pemilihan}]-[${dapil.tahun}]`,
    };
  });

  logger.info("success get all dapil");

  return {
    status: 200,
    data: dapils,
  };
};

export const findAllDapilByRole = async (
  refreshToken,
  page = 1,
  pageSize = 10
) => {
  const user = await User.findOne({
    where: { refreshToken },
  });

  if (!user) throw new AuthenticationError("Invalid refresh token");

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  let queryOptions = {
    attributes: [
      "id",
      "daerah_pemilihan",
      "kabupaten_kota",
      "provinsi",
      "tahun",
      "alokasi_kursi",
    ],
    offset: offset,
    limit: limit,
  };

  if (user.role === "admin") {
    const dapil = await Dapil.findAll(queryOptions);
    const totalItems = await Dapil.count();

    return {
      status: 200,
      data: dapil,
      currentPage: page,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  queryOptions.where = {
    user_id: user.id,
  };

  const dapil = await Dapil.findAll(queryOptions);
  const totalItems = await Dapil.count({ where: { user_id: user.id } });

  logger.info("success get all dapil by role");

  return {
    status: 200,
    data: dapil,
    currentPage: page,
    pageSize: pageSize,
    totalItems: totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
  };
};

export const filterDapilByKeyword = async (
  refreshToken,
  keyword,
  page = 1,
  pageSize = 10
) => {
  const user = await User.findOne({
    where: { refreshToken },
  });

  if (!user) throw new AuthenticationError("Invalid refresh token");

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  let queryOptions = {
    attributes: [
      "id",
      "daerah_pemilihan",
      "kabupaten_kota",
      "provinsi",
      "tahun",
      "alokasi_kursi",
    ],
    offset: offset,
    limit: limit,
  };

  queryOptions.where = {
    [Op.or]: [
      {
        daerah_pemilihan: {
          [Op.iLike]: `%${keyword}%`,
        },
      },
      {
        kabupaten_kota: {
          [Op.iLike]: `%${keyword}%`,
        },
      },
      {
        provinsi: {
          [Op.iLike]: `%${keyword}%`,
        },
      },
      // Cek apakah keyword bisa dikonversi menjadi angka sebelum mencari di alokasi_kursi
      ...(isNaN(Number(keyword))
        ? []
        : [
            {
              alokasi_kursi: {
                [Op.eq]: Number(keyword),
              },
            },
          ]),
    ],
  };

  if (user.role !== "admin") {
    queryOptions.where.user_id = user.id;
  }

  const dapil = await Dapil.findAll(queryOptions);
  const totalItems = await Dapil.count({ where: queryOptions.where });

  logger.info("success get dapil by keyword");

  return {
    status: 200,
    data: dapil,
    currentPage: page,
    pageSize: pageSize,
    totalItems: totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
  };
};

export const findDapilById = async (idDapil) => {
  const dapil = await Dapil.findOne({
    attributes: [
      "id",
      "daerah_pemilihan",
      "kabupaten_kota",
      "provinsi",
      "tahun",
      "alokasi_kursi",
    ],
    where: { id: idDapil },
  });

  if (!dapil) throw new NotFoundError("Dapil not found");

  logger.info("success get dapil by id");

  return {
    status: 200,
    data: dapil,
  };
};

export const saveDapil = async (data) => {
  const dapil = await Dapil.create(data);

  if (!dapil) throw new InvariantError("Failed created dapil");

  logger.info("success created dapil");

  return {
    status: 201,
    message: "Data successfully created",
  };
};

export const updateDapil = async (id, data) => {
  const dapil = await Dapil.findOne({
    where: {
      id: id,
    },
  });

  if (!dapil) throw new NotFoundError("Dapil not found");

  await dapil.update(data);

  logger.info("success updated dapil");

  return {
    status: 200,
    message: "Data successfully updated",
  };
};

export const deleteDapil = async (id) => {
  const dapil = await Dapil.findOne({
    where: {
      id: id,
    },
  });

  if (!dapil) throw new NotFoundError("Dapil not found");

  await dapil.destroy();

  logger.info("success deleted dapil");

  return {
    status: 204,
    message: "Data successfully deleted",
  };
};
