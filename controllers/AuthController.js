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

    const { status, token } = await googleLoginCallback(code);

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      maxAge: process.env.MAX_AGE_COOKIE * 60 * 60 * 1000,
    });

    res.status(status).json({
      accessToken: token.accessToken,
    });
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
    res.status(response.status).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { status, token } = await loginUser(email, password);
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      maxAge: process.env.MAX_AGE_COOKIE * 60 * 60 * 1000,
    });
    res.status(status).json({
      accessToken: token.accessToken,
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const response = await logoutUser(refreshToken);
    if (!response) return res.sendStatus(204);
    res.clearCookie("refreshToken");
    res.sendStatus(response.status);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const response = await refreshTokenUser(refreshToken);
    if (response.accessToken == null) return res.sendStatus(403);
    res.status(response.status).json({
      accessToken: response.accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};
