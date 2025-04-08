import Joi from "joi";
import InvariantError from "../exceptions/InvariantError.js";

// schema
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).required(),
  confPassword: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// Validator
const AuthValidator = {
  validateRegister: (payload) => {
    const validateResult = registerSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(
        validateResult.error.message.replace(/['"]/g, "")
      );
    }
  },
  validateLogin: (payload) => {
    const validateResult = loginSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(
        validateResult.error.message.replace(/['"]/g, "")
      );
    }
  },
  validateRefreshToken: (token) => {
    const validateResult = refreshTokenSchema.validate(token);
    if (validateResult.error) {
      throw new InvariantError(
        validateResult.error.message.replace(/['"]/g, "")
      );
    }
  },
};

export default AuthValidator;
