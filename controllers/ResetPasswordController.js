import {
  forgetPassword,
  resetPassword,
} from "../services/ResetPasswordService.js";

export const forgetPasswordUser = async (req, res) => {
  try {
    const msg = await forgetPassword(req.body.email);
    res.status(200).json(msg);
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
      const msg = await resetPassword(token, password);
      res.status(200).json(msg);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
};
