import {
  forgetPassword,
  resetPassword,
} from "../services/ResetPasswordService.js";

export const forgetPasswordUser = async (req, res) => {
  try {
    const forget = await forgetPassword(req.body.email);
    res.status(forget.status).json(forget.message);
  } catch (error) {
    res.status(500).json({ msg: error.message });
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
          .json({ msg: "Password and confirm password do not match" });
      }
      const reset = await resetPassword(token, password);
      res.status(reset.status).json(reset.message);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
};
