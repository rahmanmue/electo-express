import {
  findAllDapilByRole,
  filterDapilByKeyword,
  findDapilById,
  findAllDapil,
  saveDapil,
  updateDapil,
  deleteDapil,
} from "../services/DapilService.js";
import AuthValidator from "../validator/AuthValidator.js";
import DapilValidator from "../validator/DapilValidator.js";

export const getAllDapilForHome = async (req, res, next) => {
  try {
    const dapils = await findAllDapil();
    res.status(dapils.status).json(dapils);
  } catch (error) {
    next(error);
  }
};

export const getAllDapil = async (req, res, next) => {
  try {
    AuthValidator.validateRefreshToken(req.cookies);
    DapilValidator.validateQuery(req.query);

    const refreshToken = req.cookies.refreshToken;
    const { page, pageSize } = req.query;

    const dapils = await findAllDapilByRole(refreshToken, page, pageSize);
    res.status(dapils.status).json(dapils);
  } catch (error) {
    next(error);
  }
};

export const searchDapil = async (req, res, next) => {
  try {
    AuthValidator.validateRefreshToken(req.cookies);
    DapilValidator.validateQuery(req.query);

    const refreshToken = req.cookies.refreshToken;
    const { page, pageSize, keyword } = req.query;

    const dapils = await filterDapilByKeyword(
      refreshToken,
      keyword,
      page,
      pageSize
    );
    res.status(dapils.status).json(dapils);
  } catch (error) {
    next(error);
  }
};

export const getDapilById = async (req, res, next) => {
  try {
    DapilValidator.validateParams(req.params);
    const dapil = await findDapilById(req.params.id);
    res.status(dapil.status).json(dapil);
  } catch (error) {
    next(error);
  }
};

export const createDapil = async (req, res, next) => {
  try {
    DapilValidator.validateDapil(req.body);
    const saved = await saveDapil(req.body);
    res.status(saved.status).json(saved);
  } catch (error) {
    next(error);
  }
};

export const updateDapilById = async (req, res, next) => {
  try {
    DapilValidator.validateParams(req.body.id);
    DapilValidator.validateDapil(req.body);
    const updated = await updateDapil(req.body.id, req.body);
    res.status(updated.status).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteDapilById = async (req, res, next) => {
  try {
    DapilValidator.validateParams(req.params.id);
    const deleted = await deleteDapil(req.params.id);
    res.sendStatus(deleted.status);
  } catch (error) {
    next(error);
  }
};
