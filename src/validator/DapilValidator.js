import Joi from "joi";
import InvariantError from "../exceptions/InvariantError.js";

// schema
const querySchema = Joi.object({
  page: Joi.number(),
  pageSize: Joi.number(),
  keyword: Joi.string(),
});

const paramsSchema = Joi.string()
  .guid({ version: ["uuidv4"] })
  .required();

const dapilSchema = Joi.object({
  id: Joi.string().guid({ version: ["uuidv4"] }),
  daerah_pemilihan: Joi.string().required(),
  kabupaten_kota: Joi.string().required(),
  provinsi: Joi.string().required(),
  tahun: Joi.number().required(),
  alokasi_kursi: Joi.number().required(),
  user_id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
});

// validator
const DapilValidator = {
  validateQuery: (payload) => {
    const validateResult = querySchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(
        validateResult.error.message.replace(/['"]/g, "")
      );
    }
  },

  validateParams: (params) => {
    const validateResult = paramsSchema.validate(params);
    if (validateResult.error) {
      throw new InvariantError(
        validateResult.error.message.replace(/['"]/g, "")
      );
    }
  },

  validateDapil: (payload) => {
    const validateResult = dapilSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(
        validateResult.error.message.replace(/['"]/g, "")
      );
    }
  },
};

export default DapilValidator;
