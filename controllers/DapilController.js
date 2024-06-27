import Dapil from "../models/DapilModel.js";
import Users from "../models/UserModel.js";

export const getAllDapil = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await Users.findOne({
      where: {
        id: user_id,
      },
    });

    let dapil;
    if (user?.role === "admin") {
      dapil = await Dapil.findAll({
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
    } else {
      dapil = await Dapil.findAll({
        attributes: [
          "id",
          "daerah_pemilihan",
          "daerah_pemilihan",
          "kabupaten_kota",
          "provinsi",
          "tahun",
          "alokasi_kursi",
          "user_id",
        ],
        where: {
          user_id: user_id,
        },
      });
    }
    res.status(200).json(dapil);
  } catch (error) {
    console.error(error);
  }
};

export const getDapilById = async (req, res) => {
  try {
    const dapil = await Dapil.findOne({
      attributes: [
        "id",
        "daerah_pemilihan",
        "daerah_pemilihan",
        "kabupaten_kota",
        "provinsi",
        "tahun",
        "alokasi_kursi",
      ],
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(dapil);
  } catch (error) {
    console.error(error);
  }
};

export const insertDapil = async (req, res) => {
  const {
    daerah_pemilihan,
    kabupaten_kota,
    provinsi,
    tahun,
    alokasi_kursi,
    user_id,
  } = req.body;

  try {
    await Dapil.create({
      daerah_pemilihan,
      kabupaten_kota,
      provinsi,
      tahun,
      alokasi_kursi,
      user_id,
    });

    res.json({
      msg: "Data Berhasil dimasukan",
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateDapilById = async (req, res) => {
  try {
    await Dapil.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Dapil Updated" });
  } catch (error) {
    console.error(error);
  }
};

export const deleteDapilById = async (req, res) => {
  try {
    await Dapil.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Dapil Deleted" });
  } catch (error) {
    console.error(error);
  }
};
