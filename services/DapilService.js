import Dapil from "../models/DapilModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const findAllDapilByRole = async (
  refreshToken,
  page = 1,
  pageSize = 10
) => {
  try {
    const user = await User.findOne({
      where: { refreshToken },
    });

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

    if (user?.role == "admin") {
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

    return {
      status: 200,
      data: dapil,
      currentPage: page,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const filterDapilByKeyword = async (
  refreshToken,
  keyword,
  page = 1,
  pageSize = 10
) => {
  try {
    const user = await User.findOne({
      where: { refreshToken },
    });

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

    if (user?.role == "admin") {
      queryOptions.where = {
        [Op.or]: [
          {
            daerah_pemilihan: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            kabupaten_kota: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            provinsi: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            alokasi_kursi: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      };
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
      [Op.or]: [
        {
          daerah_pemilihan: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          kabupaten_kota: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          provinsi: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          alokasi_kursi: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ],
    };

    const dapil = await Dapil.findAll(queryOptions);
    const totalItems = await Dapil.count({ where: { user_id: user.id } });
    return {
      status: 200,
      data: dapil,
      currentPage: page,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findDapilById = async (idDapil) => {
  const dapil = await Dapil.findOne(
    {
      attributes: [
        "id",
        "daerah_pemilihan",
        "kabupaten_kota",
        "provinsi",
        "tahun",
        "alokasi_kursi",
      ],
    },
    { where: { id: idDapil } }
  );

  return {
    status: 200,
    data: dapil,
  };
};

export const saveDapil = async (data) => {
  await Dapil.create(data);
  return {
    status: 201,
    message: "Data successfully created",
  };
};

export const updateDapil = async (id, data) => {
  await Dapil.update(data, { where: { id: id } });
  return {
    status: 200,
    message: "Data successfully updated",
  };
};

export const deleteDapil = async (id) => {
  await Dapil.destroy({ where: { id: id } });
  return {
    status: 204,
    message: "Data successfully deleted",
  };
};
