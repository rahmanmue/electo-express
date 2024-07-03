import {
  findAllParpol,
  findParpolById,
  saveParpol,
  updateParpol,
  deleteParpol,
} from "../services/ParpolService.js";

export const getAllParpol = async (req, res) => {
  try {
    const parpols = await findAllParpol();
    res.status(parpols.status).json(parpols);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getParpolById = async (req, res) => {
  try {
    const parpol = await findParpolById(req.params.id);
    res.status(parpol.status).json(parpol);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createParpol = async (req, res) => {
  try {
    const saved = await saveParpol(req.body);
    res.status(saved.status).json(saved);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateParpolById = async (req, res) => {
  try {
    const updated = await updateParpol(req.body.id, req.body);
    res.status(updated.status).json(updated);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteParpolById = async (req, res) => {
  try {
    const deleted = await deleteParpol(req.params.id);
    res.sendStatus(deleted.status);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
