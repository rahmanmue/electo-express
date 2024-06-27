import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokenUser,
} from "../services/authService.js";

export const register = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  if (password != confPassword) {
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });
  }

  try {
    await registerUser(name, email, password, role);
    res.status(201).json({ msg: "Register Success" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { accessToken, refreshToken } = await loginUser(email, password);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: process.env.MAX_AGE_COOKIE * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  try {
    await logoutUser(refreshToken);
    res.clearCookie("refreshToken");
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookie.refreshToken;
    const accessToken = await refreshTokenUser(refreshToken);
    if (accessToken == null) return res.sendStatus(403);
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};
