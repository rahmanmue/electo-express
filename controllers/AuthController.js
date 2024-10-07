import {
  googleAuthorization,
  googleLoginCallback,
  registerUser,
  loginUser,
  logoutUser,
  refreshTokenUser,
} from "../services/AuthService.js";

export const loginGoogle = (req, res) => {
  res.redirect(googleAuthorization(req));
};

export const loginGoogleCallback = async (req, res) => {
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
    console.log("Redirecting to frontend:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  if (password != confPassword) {
    return res
      .status(400)
      .json({ message: "Password and Confirm Password do not match" });
  }

  try {
    const response = await registerUser(name, email, password, role);
    res.status(response.status).json(response);
  } catch (error) {
    if (error.message === "Email already used") {
      return res.status(409).json({ message: error.message });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { status, token } = await loginUser(email, password);
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: true, // Pastikan secure diaktifkan di HTTPS
      sameSite: "None", // Untuk cross-origin
      maxAge: process.env.MAX_AGE_COOKIE * 60 * 60 * 1000,
    });
    res.status(status).json({
      accessToken: token.accessToken,
    });
  } catch (error) {
    if (
      error.message === "Email not found" ||
      error.message === "Wrong Password"
    ) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
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
    if (error.message === "User not found") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
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
    if (error.message === "User not found") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};
