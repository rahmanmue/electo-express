import {
  findAllVoteByDapil,
  findVoteById,
  saveBulkVote,
  saveFromExcel,
  saveExcel,
  updateVote,
  deleteVote,
} from "../services/SuaraParpolService.js";
import { findDapilById } from "../services/DapilService.js";
import { sainteLagueCalculation } from "../services/SainteLagueService.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import SuaraParpolValidator from "../validator/SuaraParpolValidator.js";

export const importFromExcel = async (req, res, next) => {
  try {
    console.log(req);
    const fileName = req.file ? req.file.filename : null;
    const id_dapil = req.body.id_dapil;

    if (!fileName) throw new NotFoundError("File not found");

    const response = await saveFromExcel({
      fileName: fileName,
      id_dapil: id_dapil,
    });

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export const importExcel = async (req, res, next) => {
  try {
    const body = {
      file: req.file,
      id_dapil: req.body.id_dapil,
    };

    if (!req.file) throw new NotFoundError("File not found");

    SuaraParpolValidator.validateSuaraParpolDoc(body);

    const response = await saveExcel(body);

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCalculationSuaraParpol = async (req, res, next) => {
  try {
    SuaraParpolValidator.validateParams(req.params);
    const votes = await findAllVoteByDapil(req.params.dapil_id);
    const seatCount = (await findDapilById(req.params.dapil_id)).data
      .alokasi_kursi;
    const calculation = sainteLagueCalculation(votes.data, seatCount);
    res.status(calculation.status).json(calculation);
  } catch (error) {
    next(error);
  }
};

export const getSuaraParpolByDapilId = async (req, res, next) => {
  try {
    SuaraParpolValidator.validateParams(req.params);
    const suaraParpolDapil = await findAllVoteByDapil(req.params.dapil_id);
    res.status(suaraParpolDapil.status).json(suaraParpolDapil);
  } catch (error) {
    next(error);
  }
};

export const getSuaraParpolById = async (req, res, next) => {
  try {
    SuaraParpolValidator.validateId(req.params.id);
    const suaraParpol = await findVoteById(req.params.id);
    res.status(suaraParpol.status).json(suaraParpol);
  } catch (error) {
    next(error);
  }
};

export const createBulkSuaraParpol = async (req, res, next) => {
  try {
    SuaraParpolValidator.validateSuaraParpolBulk(req.body);
    const saved = await saveBulkVote(req.body);
    res.status(saved.status).json(saved);
  } catch (error) {
    next(error);
  }
};

export const updateSuaraParpolById = async (req, res, next) => {
  try {
    SuaraParpolValidator.validateId(req.body.id);
    SuaraParpolValidator.validateSuaraParpol(req.body);
    const updated = await updateVote(req.body.id, req.body);
    res.status(updated.status).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteSuaraParpolById = async (req, res, next) => {
  try {
    SuaraParpolValidator.validateId(req.params.id);
    const deleted = await deleteVote(req.params.id);
    res.sendStatus(deleted.status);
  } catch (error) {
    next(error);
  }
};
