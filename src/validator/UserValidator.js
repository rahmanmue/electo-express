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

const userSchema = Joi.object({
  id: Joi.string().guid({ version: ["uuidv4"] }),
  name: Joi.string(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6),
  role: Joi.string().valid("user", "admin"),
});

// validator
const UserValidator = {
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

  validateUser: (payload) => {
    const validateResult = userSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(
        validateResult.error.message.replace(/['"]/g, "")
      );
    }
  },
};

export default UserValidator;
