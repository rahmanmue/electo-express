import Dapil from "../models/DapilModel.js";
import { findUserById } from "./userService.js";

export const findAllDapilByRole = async (userId) => {
  try {
    const role = await findUserById(userId).role;

    if (role != "admin") {
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

      return dapil;
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
          user_id: userId,
        },
      }
    );

    return dapil;
  } catch (error) {
    console.error(error);
    return { msg: error.message };
  }
};

export const findDapilById = async (idDapil) => {
  return await Dapil.findOne(
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
};

export const saveDapil = async (data) => {
  return await Dapil.create(data);
};

export const updateDapil = async (id, data) => {
  return await Dapil.update(data, { where: { id: id } });
};

export const deleteDapil = async (id) => {
  return await Dapil.destroy({ where: { id: id } });
};
