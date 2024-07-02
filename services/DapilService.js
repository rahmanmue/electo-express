import Dapil from "../models/DapilModel.js";
import User from "../models/UserModel.js";

export const findAllDapilByRole = async (refreshToken) => {
  try {
    const user = await User.findOne({
      where: { refreshToken },
    });

    if (user.role != "admin") {
      const dapil = await Dapil.findAll({
        attributes: [
          "id",
          "daerah_pemilihan",
          "daerah_pemilihan",
          "kabupaten_kota",
          "provinsi",
          "tahun",
          "alokasi_kursi",
        ],
      });

      return {
        status: 200,
        data: dapil,
      };
    }

    const dapil = await Dapil.findAll(
      {
        attributes: [
          "id",
          "daerah_pemilihan",
          "daerah_pemilihan",
          "kabupaten_kota",
          "provinsi",
          "tahun",
          "alokasi_kursi",
        ],
      },
      {
        where: {
          user_id: user.id,
        },
      }
    );

    return {
      status: 200,
      data: dapil,
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
