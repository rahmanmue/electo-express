import User from "../models/UserModel.js";
import ResetPasswordToken from "../models/ResetPasswordToken.js";
import transporter from "../config/emailConfig.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const forgetPassword = async (email) => {
  try {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) throw new Error("User not found");

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

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        throw new Error("Failed to send email");
      }
    });

    return { msg: "Email sent" };
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

export const resetPassword = async (token, password) => {
  try {
    const resetToken = await ResetPasswordToken.findOne({
      where: { token },
    });

    if (!resetToken || resetToken.expires_at < new Date()) {
      throw new Error("Invalid token");
    }

    const user = await User.findOne({
      where: { id: resetToken.user_id },
    });

    if (!user) throw new Error("User not found");

    const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt());
    user.password = hashPassword;
    await user.save();

    return { msg: "Password reset success" };
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};
