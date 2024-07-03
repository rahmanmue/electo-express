import Profile from "../models/ProfileModel.js";
import User from "../models/UserModel.js";
import path from "path";
import fs from "fs";

export const findProfile = async (refreshToken) => {
  const user = await User.findOne({
    where: { refreshToken: refreshToken },
  });

  if (!user) throw new Error("User not found");

  const profile = await Profile.findOne({
    attributes: ["id", "user_id", "full_name", "avatar"],
    where: { user_id: user.id },
  });

  return {
    status: 200,
    data: profile,
  };
};

export const updateProfile = async (data) => {
  try {
    const profile = await Profile.findOne({ where: { user_id: data.user_id } });

    if (!profile) throw new Error("Profile not found");

    if (data.avatar) {
      const previousAvatar = profile.avatar;
      if (previousAvatar) {
        const fullPath = path.join(
          process.cwd(),
          process.env.UPLOAD_DIR,
          previousAvatar
        );
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
      profile.avatar = data.avatar;
    }
    profile.full_name = data.full_name;
    profile.save();

    return {
      status: 200,
      message: "Profile updated",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAvatar = (avatar) => {
  return new Promise((resolve, rejects) => {
    const avatarPath = path.join(process.cwd(), process.env.UPLOAD_DIR, avatar);

    if (!fs.existsSync(avatarPath)) {
      rejects({ status: 404, message: "Avatar not found" });
    }

    fs.readFile(avatarPath, (err, data) => {
      if (err) {
        rejects({
          status: 500,
          message: "Error reading avatar file",
          error: err.message,
        });
      }

      resolve({
        status: 200,
        data,
      });
    });
  });
};
