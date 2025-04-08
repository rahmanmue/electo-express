import InvariantError from "../exceptions/InvariantError.js";
import {
  forgetPassword,
  resetPassword,
} from "../services/ResetPasswordService.js";
import ResetPasswordValidator from "../validator/ResetPasswordValidator.js";

export const forgetPasswordUser = async (req, res, next) => {
  try {
    ResetPasswordValidator.validateForgetPassword(req.body);
    const forget = await forgetPassword(req.body.email);
    res.status(forget.status).json(forget);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordUser = async (req, res, next) => {
  try {
    ResetPasswordValidator.validateParams(req.params);
    ResetPasswordValidator.validateResetPassword(req.body);
    const { password, confPassword } = req.body;
    if (password !== confPassword) {
      throw new InvariantError("Password and confirm password do not match");
    }
    const reset = await resetPassword(req.params.token, password);
    res.status(reset.status).json(reset);
  } catch (error) {
    next(error);
  }
};
