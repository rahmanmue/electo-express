import {
  findAllVoteByDapil,
  findVoteById,
  saveBulkVote,
  updateVote,
  deleteVote,
} from "../services/SuaraParpolService.js";
import { findDapilById } from "../services/DapilService.js";
import { sainteLagueCalculation } from "../services/SainteLagueService.js";

export const getCalculationSuaraParpol = async (req, res) => {
  try {
    const votes = await findAllVoteByDapil(req.params.dapil_id);
    const seatCount = await findDapilById(req.params.dapil_id).alokasi_kursi;
    const calculation = sainteLagueCalculation(votes, seatCount);
    res.status(200).json(calculation);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const getSuaraParpolByDapilId = async (req, res) => {
  try {
    const suaraParpolDapil = await findAllVoteByDapil(req.params.dapil_id);
    res.status(200).json(suaraParpolDapil);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const getSuaraParpolById = async (req, res) => {
  try {
    const suaraParpol = await findVoteById(req.params.id);
    res.status(200).json(suaraParpol);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const createBulkSuaraParpol = async (req, res) => {
  try {
    await saveBulkVote(req.body);
    res.status(201).json({ msg: "Created" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const updateSuaraParpolById = async (req, res) => {
  try {
    const data = req.body;
    await updateVote(data.id, data);
    res.status(200).json({ msg: "Updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const deleteSuaraParpolById = async (req, res) => {
  try {
    await deleteVote(req.params.id);
    res.status(200).json({ msg: "Deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};
