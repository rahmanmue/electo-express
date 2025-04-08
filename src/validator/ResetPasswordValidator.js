import Joi from "joi";
import InvariantError from "../exceptions/InvariantError.js";

const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
  confPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const paramsSchema = Joi.object({
  token: Joi.string().required(),
});

const ResetPasswordValidator = {
  validateForgetPassword: (email) => {
    const validationResult = forgetPasswordSchema.validate(email);
    if (validationResult.error) {
      throw new InvariantError(
        validationResult.error.message.replace(/['"]/g, "")
      );
    }
  },

  validateResetPassword: (payload) => {
    const validationResult = resetPasswordSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(
        validationResult.error.message.replace(/['"]/g, "")
      );
    }
  },

  validateParams: (token) => {
    const validationResult = paramsSchema.validate(token);
    if (validationResult.error) {
      throw new InvariantError(
        validationResult.error.message.replace(/['"]/g, "")
      );
    }
  },
};

export default ResetPasswordValidator;
