import {
  findAllParpol,
  findParpolById,
  saveParpol,
  filterParpolByKeyword,
  updateParpol,
  deleteParpol,
  jsonToExcelParpol,
} from "../services/ParpolService.js";
import ParpolValidator from "../validator/ParpolValidator.js";

export const getAllParpol = async (req, res, next) => {
  try {
    ParpolValidator.validateQuery(req.query);
    console.log(req.query);
    const { page, pageSize } = req.query;
    const parpols = await findAllParpol(page, pageSize);
    res.status(parpols.status).json(parpols);
  } catch (error) {
    next(error);
  }
};

export const getParpolById = async (req, res, next) => {
  try {
    ParpolValidator.validateParams(req.params);
    const parpol = await findParpolById(req.params.id);
    res.status(parpol.status).json(parpol);
  } catch (error) {
    next(error);
  }
};

export const searchParpol = async (req, res, next) => {
  try {
    ParpolValidator.validateQuery(req.query);
    const { page, pageSize, keyword } = req.query;
    const parpol = await filterParpolByKeyword(keyword, page, pageSize);
    res.status(parpol.status).json(parpol);
  } catch (error) {
    next(error);
  }
};

export const downloadParpol = async (req, res, next) => {
  try {
    const buffer = await jsonToExcelParpol();
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ParpolVote.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const createParpol = async (req, res, next) => {
  try {
    ParpolValidator.validateParpol(req.body);
    const saved = await saveParpol(req.body);
    res.status(saved.status).json(saved);
  } catch (error) {
    next(error);
  }
};

export const updateParpolById = async (req, res, next) => {
  try {
    ParpolValidator.validateId(req.body.id);
    ParpolValidator.validateParpol(req.body);
    const updated = await updateParpol(req.body);
    res.status(updated.status).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteParpolById = async (req, res, next) => {
  try {
    ParpolValidator.validateParams(req.params);
    const deleted = await deleteParpol(req.params.id);
    res.sendStatus(deleted.status);
  } catch (error) {
    next(error);
  }
};
