import {
  findAllDapilByRole,
  filterDapilByKeyword,
  findDapilById,
  saveDapil,
  updateDapil,
  deleteDapil,
} from "../services/DapilService.js";

export const getAllDapil = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const dapils = await findAllDapilByRole(refreshToken, page, pageSize);
    res.status(dapils.status).json(dapils);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchDapil = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const keyword = req.query.keyword;
    const dapils = await filterDapilByKeyword(
      refreshToken,
      keyword,
      page,
      pageSize
    );
    res.status(dapils.status).json(dapils);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDapilById = async (req, res) => {
  try {
    const dapil = await findDapilById(req.params.id);
    res.status(dapil.status).json(dapil);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDapil = async (req, res) => {
  try {
    const saved = await saveDapil(req.body);
    res.status(saved.status).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDapilById = async (req, res) => {
  try {
    const updated = await updateDapil(req.body.id, req.body);
    res.status(updated.status).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDapilById = async (req, res) => {
  try {
    const deleted = await deleteDapil(req.params.id);
    res.sendStatus(deleted.status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
