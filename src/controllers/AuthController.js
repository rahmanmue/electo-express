import InvariantError from "../exceptions/InvariantError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import {
  googleAuthorization,
  googleLoginCallback,
  registerUser,
  loginUser,
  logoutUser,
  refreshTokenUser,
} from "../services/AuthService.js";
import AuthValidator from "../validator/AuthValidator.js";

export const loginGoogle = (req, res) => {
  res.redirect(googleAuthorization(req));
};

export const loginGoogleCallback = async (req, res, next) => {
  try {
    const code = req.query.code;

    const { token } = await googleLoginCallback(req, code);

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: true, // Pastikan secure diaktifkan di HTTPS
      sameSite: "None", // Untuk cross-origin
      maxAge: process.env.MAX_AGE_COOKIE * 60 * 60 * 1000,
    });

    const redirectUrl = `${process.env.FRONTEND_URL}/google/callback?accessToken=${token.accessToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    AuthValidator.validateRegister(req.body);
    const { name, email, password, confPassword, role } = req.body;
    if (password != confPassword) {
      throw new InvariantError("Password and confirm password must be match");
    }
    const response = await registerUser(name, email, password, role);
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    AuthValidator.validateLogin(req.body);
    const { email, password } = req.body;
    const { status, token } = await loginUser(email, password);
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: process.env.MAX_AGE_COOKIE * 60 * 60 * 1000,
    });
    res.status(status).json({
      accessToken: token.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    AuthValidator.validateRefreshToken(req.cookies);
    const { refreshToken } = req.cookies;
    const response = await logoutUser(refreshToken);
    if (!response) return res.sendStatus(204);
    res.clearCookie("refreshToken");
    res.sendStatus(response.status);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    AuthValidator.validateRefreshToken(req.cookies);
    const refreshToken = req.cookies.refreshToken;
    const response = await refreshTokenUser(refreshToken);
    if (response.accessToken == null)
      throw new NotFoundError("Access token is null");
    res.status(response.status).json({
      accessToken: response.accessToken,
    });
  } catch (error) {
    next(error);
  }
};
