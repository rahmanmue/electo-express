import {
  googleAuthorization,
  googleLoginCallback,
  registerUser,
  loginUser,
  logoutUser,
  refreshTokenUser,
} from "../services/AuthService.js";

export const loginGoogle = (req, res) => {
  res.redirect(googleAuthorization());
};

export const loginGoogleCallback = async (req, res) => {
  try {
    const code = req.query.code;

    const response = await googleLoginCallback(code);

    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      maxAge: process.env.MAX_AGE_COOKIE * 60 * 60 * 1000,
    });

    res.status(response.status).json(response.accessToken);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  if (password != confPassword) {
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });
  }

  try {
    const response = await registerUser(name, email, password, role);
    res.status(response.status).json(response.message);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await loginUser(email, password);
    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      maxAge: process.env.MAX_AGE_COOKIE * 60 * 60 * 1000,
    });
    res.status(response.status).json(response.accessToken);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  try {
    const response = await logoutUser(refreshToken);
    if (!response) return res.sendStatus(204);
    res.clearCookie("refreshToken");
    res.status(response.status).json(response.message);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const response = await refreshTokenUser(refreshToken);
    if (response.accessToken == null) return res.sendStatus(403);
    res.status(response.status).json(response.accessToken);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
