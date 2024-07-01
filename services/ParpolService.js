import Parpol from "../models/ParpolModel";

export const findAllParpol = async () => {
  return await Parpol.findAll();
};

export const findParpolById = async (id) => {
  return await Parpol.findOne({ where: { id: id } });
};

export const saveParpol = async (data) => {
  return await Parpol.create(data);
};

export const updateParpol = async (id, data) => {
  return await Parpol.update(data, { where: { id: id } });
};

export const deleteParpol = async (id) => {
  return await Parpol.destroy({ where: { id: id } });
};
