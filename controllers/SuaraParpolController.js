import {
  findAllVoteByDapil,
  findVoteById,
  saveBulkVote,
  saveFromExcel,
  updateVote,
  deleteVote,
} from "../services/SuaraParpolService.js";
import { findDapilById } from "../services/DapilService.js";
import { sainteLagueCalculation } from "../services/SainteLagueService.js";

export const importFromExcel = async (req, res) => {
  try {
    const fileName = req.file ? req.file.filename : null;
    const id_dapil = req.body.id_dapil;

    if (!fileName) return res.status(400).json({ msg: "File not found" });

    const response = await saveFromExcel({
      fileName: fileName,
      id_dapil: id_dapil,
    });

    res.status(response.status).json(response.message);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const getCalculationSuaraParpol = async (req, res) => {
  try {
    const votes = await findAllVoteByDapil(req.params.dapil_id);
    const seatCount = await findDapilById(req.params.dapil_id).alokasi_kursi;
    const calculation = sainteLagueCalculation(votes, seatCount);
    res.status(calculation.status).json(calculation.data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const getSuaraParpolByDapilId = async (req, res) => {
  try {
    const suaraParpolDapil = await findAllVoteByDapil(req.params.dapil_id);
    res.status(suaraParpolDapil.status).json(suaraParpolDapil.data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const getSuaraParpolById = async (req, res) => {
  try {
    const suaraParpol = await findVoteById(req.params.id);
    res.status(suaraParpol.status).json(suaraParpol.data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const createBulkSuaraParpol = async (req, res) => {
  try {
    const saved = await saveBulkVote(req.body);
    res.status(saved.status).json(saved.message);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const updateSuaraParpolById = async (req, res) => {
  try {
    const updated = await updateVote(req.body.id, req.body);
    res.status(updated.status).json(updated.message);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const deleteSuaraParpolById = async (req, res) => {
  try {
    const deleted = await deleteVote(req.params.id);
    res.status(deleted.status).json(deleted.message);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};
