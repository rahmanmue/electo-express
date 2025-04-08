import Joi from "joi";
import InvariantError from "../exceptions/InvariantError.js";

const suaraParpolDocSchema = Joi.object({
  file: Joi.object({
    originalname: Joi.string().required(), // Nama asli file
    mimetype: Joi.string()
      .valid(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "application/wps-office.xlsx",
        "Excel.application/wps-office.xlsx"
      )
      .required(),
    size: Joi.number().max(5000000).required(),
  }).unknown(),
  id_dapil: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
});

const suaraParpolParams = Joi.object({
  dapil_id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
});

const suaraParpolId = Joi.string()
  .guid({ version: ["uuidv4"] })
  .required();

const suaraParpolSchema = Joi.object({
  id: Joi.string().guid({ version: ["uuidv4"] }),
  nama_parpol: Joi.string().required(),
  total_suara_sah: Joi.number().required(),
});

const suaraParpolBulkSchema = Joi.array().items(
  Joi.object({
    nama_parpol: Joi.string().required(),
    total_suara_sah: Joi.number().required(),
    daerah_pemilihan_id: Joi.string()
      .guid({ version: ["uuidv4"] })
      .required(),
  })
);

const SuaraParpolValidator = {
  validateSuaraParpol: (payload) => {
    const validationResult = suaraParpolSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(
        validationResult.error.message.replace(/['"]/g, "")
      );
    }
  },
  validateSuaraParpolBulk: (payload) => {
    const validationResult = suaraParpolBulkSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(
        validationResult.error.message.replace(/['"]/g, "")
      );
    }
  },
  validateSuaraParpolDoc: (payload) => {
    const validationResult = suaraParpolDocSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(
        validationResult.error.message.replace(/['"]/g, "")
      );
    }
  },
  validateParams: (params) => {
    const validationResult = suaraParpolParams.validate(params);
    if (validationResult.error) {
      throw new InvariantError(
        validationResult.error.message.replace(/['"]/g, "")
      );
    }
  },
  validateId: (id) => {
    const validationResult = suaraParpolId.validate(id);
    if (validationResult.error) {
      throw new InvariantError(
        validationResult.error.message.replace(/['"]/g, "")
      );
    }
  },
};

export default SuaraParpolValidator;
