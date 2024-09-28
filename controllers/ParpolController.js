import {
  findAllParpol,
  findParpolById,
  saveParpol,
  filterParpolByKeyword,
  updateParpol,
  deleteParpol,
  jsonToExcelParpol,
} from "../services/ParpolService.js";

export const getAllParpol = async (req, res) => {
  try {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const parpols = await findAllParpol(page, pageSize);
    res.status(parpols.status).json(parpols);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getParpolById = async (req, res) => {
  try {
    const parpol = await findParpolById(req.params.id);
    res.status(parpol.status).json(parpol);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchParpol = async (req, res) => {
  try {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const keyword = req.query.keyword;
    const parpol = await filterParpolByKeyword(keyword, page, pageSize);
    res.status(parpol.status).json(parpol);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadParpol = async (req, res) => {
  const buffer = await jsonToExcelParpol();
  res.setHeader("Content-Disposition", "attachment; filename=ParpolVote.xlsx");
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.send(buffer);
};

export const createParpol = async (req, res) => {
  try {
    const saved = await saveParpol(req.body);
    res.status(saved.status).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateParpolById = async (req, res) => {
  try {
    const updated = await updateParpol(req.body);
    res.status(updated.status).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteParpolById = async (req, res) => {
  try {
    const deleted = await deleteParpol(req.params.id);
    res.sendStatus(deleted.status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
