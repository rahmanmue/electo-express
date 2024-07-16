import {
  forgetPassword,
  resetPassword,
} from "../services/ResetPasswordService.js";

export const forgetPasswordUser = async (req, res) => {
  try {
    const forget = await forgetPassword(req.body.email);
    res.status(forget.status).json(forget);
  } catch (error) {
    if (error.message === "User not found") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const resetPasswordUser = async (req, res) => {
  {
    try {
      const token = req.params.token;
      const password = req.body.password;
      const confirmPassword = req.body.confPassword;
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "Password and confirm password do not match" });
      }
      const reset = await resetPassword(token, password);
      res.status(reset.status).json(reset);
    } catch (error) {
      if (
        error.message === "Invalid token" ||
        error.message === "User not found"
      ) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }
};
