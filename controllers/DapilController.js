import {
  findAllDapilByRole,
  findDapilById,
  saveDapil,
  updateDapil,
  deleteDapil,
} from "./../services/dapilService.js";

export const getAllDapil = async (req, res) => {
  try {
    const dapil = await findAllDapilByRole(req.params.user_id);
    res.status(200).json(dapil);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const getDapilById = async (req, res) => {
  try {
    const dapil = await findDapilById(req.params.id);
    res.status(200).json(dapil);
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const createDapil = async (req, res) => {
  try {
    await saveDapil(req.body);
    res.json({
      msg: "Dapil created",
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const updateDapilById = async (req, res) => {
  try {
    await updateDapil(req.params.id, req.body);
    res.status(200).json({ msg: "Dapil updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};

export const deleteDapilById = async (req, res) => {
  try {
    await deleteDapil(req.params.id);
    res.status(200).json({ msg: "Dapil deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.error(error);
  }
};
