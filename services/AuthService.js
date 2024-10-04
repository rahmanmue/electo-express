import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import Profile from "../models/ProfileModel.js";
import { authorizationUrl, oauth2Client } from "../config/oauth2Config.js";
import { google } from "googleapis";
import db from "../config/database.js";

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

export const googleAuthorization = (req) => {
  return authorizationUrl(req);
};

export const googleLoginCallback = async (req, code) => {
  const transaction = await db.transaction();
  try {
    const oauth2Client = oauth2Client(req);

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
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

    return {
      status: 200,
      token,
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const registerUser = async (name, email, password, role) => {
  const transaction = await db.transaction();

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
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

    return {
      status: 201,
      message: "User created successfully",
    };
  } catch (error) {
    await transaction.rollback();
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error("Email already used");
    } else {
      throw new Error(error.message);
    }
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("Email not found");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Wrong Password");
    }

    const token = await saveTokenUser(user);

    return {
      status: 200,
      token,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUser = async (refreshToken) => {
  try {
    const user = await User.findOne({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (!user) throw new Error("User not found");

    await User.update(
      {
        refreshToken: null,
      },
      {
        where: { id: user.id },
      }
    );

    return {
      status: 204,
      message: "Logout successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const refreshTokenUser = async (refreshToken) => {
  try {
    const user = await User.findOne({
      where: { refreshToken: refreshToken },
    });

    if (!user) throw new Error("User not found");

    const accessToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decode) => {
        if (err) return null;

        const { userId, name, email, role } = decode;

        const accessToken = jwt.sign(
          { userId, name, email, role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRED,
          }
        );

        return accessToken;
      }
    );

    return {
      status: 200,
      accessToken: accessToken,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
