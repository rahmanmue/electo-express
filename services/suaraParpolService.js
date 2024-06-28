import SuaraParpol from "../models/SuaraParpolModel.js";

export const findAllVoteByDapil = async (idDapil) => {
  return await SuaraParpol.findAll(
    {
      attributes: ["id", "nama_parpol", "total_suara_sah"],
    },
    {
      where: {
        daerah_pemilihan_id: idDapil,
      },
    }
  );
};

export const findVoteById = async (idVote) => {
  return await SuaraParpol.findOne({
    attributes: ["id", "nama_parpol", "total_suara_sah"],
    where: {
      id: idVote,
    },
  });
};

export const saveBulkVote = async (data) => {
  return await SuaraParpol.bulkCreate(data);
};

export const updateVote = async (idVote, data) => {
  return await SuaraParpol.update(data, { where: { id: idVote } });
};

export const deleteVote = async (idVote) => {
  return await SuaraParpol.destroy({ where: { id: idVote } });
};
