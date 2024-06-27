import SuaraParpol from "../models/SuaraParpolModel.js";

export const getSuaraParpolByDapilId = async (req, res) => {
  try {
    const suaraParpolDapil = await SuaraParpol.findAll({
      attributes: ["id", "nama_parpol", "total_suara_sah"],
      where: {
        daerah_pemilihan_id: req.params.dapil_id,
      },
    });
    res.status(200).json(suaraParpolDapil);
  } catch (error) {
    console.error(error);
  }
};

export const getSuaraParpolById = async (req, res) => {
  try {
    const suaraParpol = await SuaraParpol.findOne({
      attributes: ["id", "nama_parpol", "total_suara_sah"],
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(suaraParpol);
  } catch (error) {
    console.error(error);
  }
};

export const insertBulkSuaraParpol = async (req, res) => {
  try {
    await SuaraParpol.bulkCreate(req.body);
    res.json({
      msg: "Data Berhasil dimasukan",
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateSuaraParpolById = async (req, res) => {
  try {
    await SuaraParpol.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Updated" });
  } catch (error) {
    console.error(error);
  }
};

export const deleteSuaraParpolById = async (req, res) => {
  try {
    await SuaraParpol.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Deleted" });
  } catch (error) {
    console.error(error);
  }
};
