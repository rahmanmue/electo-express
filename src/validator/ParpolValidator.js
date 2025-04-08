import Joi from "joi";
import InvariantError from "../exceptions/InvariantError.js";

// schema
const querySchema = Joi.object({
  page: Joi.number(),
  pageSize: Joi.number(),
  keyword: Joi.string(),
});

const paramsSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
});

const idParpol = Joi.string()
  .guid({ version: ["uuidv4"] })
  .required();

const parpolSchema = Joi.object({
  id: Joi.string().guid({ version: ["uuidv4"] }),
  name: Joi.string().required(),
});

// validator
const ParpolValidator = {
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

  validateParpol: (payload) => {
    const validateResult = parpolSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(
        validateResult.error.message.replace(/['"]/g, "")
      );
    }
  },

  validateId: (id) => {
    const validateResult = idParpol.validate(id);
    if (validateResult.error) {
      throw new InvariantError(
        validateResult.error.message.replace(/['"]/g, "")
      );
    }
  },
};

export default ParpolValidator;
