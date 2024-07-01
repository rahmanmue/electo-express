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
    res.status(200).json(parpols);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getParpolById = async (req, res) => {
  try {
    const parpol = await findParpolById(req.params.id);
    res.status(200).json(parpol);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createParpol = async (req, res) => {
  try {
    const data = req.body;
    await saveParpol(data);
    res.json({
      msg: "Parpol created",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateParpolById = async (req, res) => {
  try {
    const data = req.body;
    await updateParpol(data.id, data);
    res.status(200).json({ msg: "Parpol updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteParpolById = async (req, res) => {
  try {
    await deleteParpol(req.params.id);
    res.status(200).json({ msg: "Parpol deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
