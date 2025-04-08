import User from "../models/UserModel.js";
import ResetPasswordToken from "../models/ResetPasswordToken.js";
import transporter from "../config/emailConfig.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import NotFoundError from "../exceptions/NotFoundError.js";
import InvariantError from "../exceptions/InvariantError.js";
import AuthorizationError from "../exceptions/AuthorizationError.js";
import logger from "../utils/logger.js";

export const forgetPassword = async (email) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) throw new NotFoundError("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  const expireAt = new Date().setHours(new Date().getHours() + 1);

  const resetPassword = await ResetPasswordToken.findOne({
    where: { user_id: user.id },
  });

  if (resetPassword) {
    resetPassword.token = token;
    resetPassword.expires_at = expireAt;
    await resetPassword.save();
  } else {
    await ResetPasswordToken.create({
      user_id: user.id,
      token: token,
      expires_at: expireAt,
    });
  }

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  // kirim email dengan link reset password
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    logger.info(`success sent ${info.response}`);

    return {
      status: 200,
      message: "Reset password link sent to your email",
    };
  } catch (error) {
    throw new InvariantError(error.message);
  }
};

export const resetPassword = async (token, password) => {
  const resetToken = await ResetPasswordToken.findOne({
    where: { token },
  });

  if (!resetToken || resetToken.expires_at < new Date()) {
    throw new AuthorizationError("token has expired");
  }

  const user = await User.findOne({
    where: { id: resetToken.user_id },
  });

  if (!user) throw new NotFoundError("User not found");

  const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt());
  user.password = hashPassword;
  await user.save();

  logger.info("success reset password");

  return {
    status: 200,
    message: "Password reset successfully",
  };
};
