import {
  findAllDapilByRole,
  findDapilById,
  saveDapil,
  updateDapil,
  deleteDapil,
} from "../services/DapilService.js";

export const getAllDapil = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const dapils = await findAllDapilByRole(refreshToken);
    res.status(dapils.status).json(dapils);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const getDapilById = async (req, res) => {
  try {
    const dapil = await findDapilById(req.params.id);
    res.status(dapil.status).json(dapil);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const createDapil = async (req, res) => {
  try {
    const saved = await saveDapil(req.body);
    res.status(saved.status).json(saved);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const updateDapilById = async (req, res) => {
  try {
    const updated = await updateDapil(req.body.id, req.body);
    res.status(updated.status).json(updated);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const deleteDapilById = async (req, res) => {
  try {
    const deleted = await deleteDapil(req.params.id);
    res.sendStatus(deleted.status);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};
