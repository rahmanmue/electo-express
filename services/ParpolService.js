import Parpol from "../models/ParpolModel.js";

export const findAllParpol = async () => {
  const parpol = await Parpol.findAll();
  return {
    status: 200,
    data: parpol,
  };
};

export const findParpolById = async (id) => {
  const parpol = await Parpol.findOne({ where: { id: id } });
  return {
    status: 200,
    data: parpol,
  };
};

export const saveParpol = async (data) => {
  await Parpol.create(data);
  return {
    status: 201,
    message: "Data successfully created",
  };
};

export const updateParpol = async (id, data) => {
  await Parpol.update(data, { where: { id: id } });
  return {
    status: 200,
    message: "Data successfully updated",
  };
};

export const deleteParpol = async (id) => {
  await Parpol.destroy({ where: { id: id } });
  return {
    status: 204,
    message: "Data successfully deleted",
  };
};
