import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const registerUser = async (name, email, password, role) => {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    return { msg: "Register Success" };
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error("Email already used");
    } else {
      throw new Error("Internal Server Error");
    }
  }
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Wrong Password");
  }

  const userId = user.id;
  const name = user.name;
  const role = user.role;

  const accessToken = jwt.sign(
    { userId, name, email, role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRED,
    }
  );

  const refreshToken = jwt.sign(
    { userId, name, email, role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRED,
    }
  );

  await User.update(
    { refreshToken },
    {
      where: { id: userId },
    }
  );

  return { accessToken, refreshToken };
};

export const logoutUser = async (userId) => {
  await User.update(
    {
      refreshToken: null,
    },
    {
      where: { id: userId },
    }
  );

  return { msg: "logout success" };
};

export const refreshTokenUser = async (refreshToken) => {
  try {
    const user = await User.findOne({
      where: { refreshToken },
    });

    if (!user) return null;

    jwt.verify(
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
  } catch (error) {
    return error;
  }
};
