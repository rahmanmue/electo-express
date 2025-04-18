import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import Profile from "../models/ProfileModel.js";
import { authorizationUrl, oauth2Client } from "../config/oauth2Config.js";
import { google } from "googleapis";
import db from "../config/database.js";
import InvariantError from "../exceptions/InvariantError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import AuthenthicationError from "../exceptions/AuthenthicationError.js";
import logger from "../utils/logger.js";

const saveTokenUser = async (data) => {
  const accessToken = jwt.sign(
    { userId: data.id, name: data.name, email: data.email, role: data.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRED,
    }
  );

  const refreshToken = jwt.sign(
    { userId: data.id, name: data.name, email: data.email, role: data.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRED,
    }
  );

  await User.update(
    {
      refreshToken: refreshToken,
    },
    {
      where: { id: data.id },
    }
  );

  return { accessToken, refreshToken };
};

export const googleAuthorization = (req) => authorizationUrl(req);

export const googleLoginCallback = async (req, code) => {
  const transaction = await db.transaction();
  try {
    const oauth = oauth2Client(req);

    const { tokens } = await oauth.getToken(code);

    oauth.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();

    let user = await User.findOne({
      where: { email: data.email },
      transaction: transaction,
    });

    if (!user) {
      user = await User.create(
        {
          name: data.name,
          email: data.email,
          password: null,
        },
        {
          transaction: transaction,
        }
      );

      await Profile.create(
        {
          full_name: data.name,
          user_id: user.id,
          avatar: data.picture,
        },
        {
          transaction: transaction,
        }
      );

      await transaction.commit();
    }

    const token = await saveTokenUser(user);
    logger.info("success login user with google account");

    return {
      status: 200,
      token,
    };
  } catch (error) {
    await transaction.rollback();
    throw new InvariantError(error.message);
  }
};

export const registerUser = async (name, email, password, role) => {
  const transaction = await db.transaction();

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new InvariantError("Email already used");

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.create(
      {
        name,
        email,
        password: hashPassword,
        role,
      },
      {
        transaction: transaction,
      }
    );

    await Profile.create(
      {
        user_id: user.id,
      },
      {
        transaction: transaction,
      }
    );

    await transaction.commit();
    logger.info("success register user");

    return {
      status: 201,
      message: "User created successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw new InvariantError(error.message);
  }
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) throw new NotFoundError("Email not found");

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw new AuthenthicationError("Wrong password");

  const token = await saveTokenUser(user);

  logger.info("success login user");

  return {
    status: 200,
    token,
  };
};

export const logoutUser = async (refreshToken) => {
  const user = await User.findOne({
    where: {
      refreshToken: refreshToken,
    },
  });

  if (!user) throw new NotFoundError("User not found");

  await user.update({
    refreshToken: null,
  });

  logger.info("success logout");

  return {
    status: 204,
    message: "Logout successfully",
  };
};

export const refreshTokenUser = async (refreshToken) => {
  const user = await User.findOne({
    where: { refreshToken: refreshToken },
  });

  if (!user) throw new AuthenthicationError("Invalid refresh token");

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const { userId, name, email, role } = decoded;

    const accessToken = jwt.sign(
      { userId, name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRED }
    );

    logger.info("success created refreshToken");

    return {
      status: 200,
      accessToken: accessToken,
    };
  } catch (error) {
    throw new AuthenthicationError("Invalid refresh token");
  }
};
