import Profile from "../models/ProfileModel.js";
import path from "path";
import fs from "fs";

export const findProfileById = async (userId) => {
  return await Profile.findOne({
    attributes: ["id", "user_id", "full_name", "avatar"],
    where: { user_id: userId },
  });
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
          "assets/uploads",
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

    return profile;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAvatar = (avatar) => {
  return new Promise((resolve, rejects) => {
    const avatarPath = path.join(process.cwd(), "assets/uploads", avatar);

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

      resolve(data);
    });
  });
};
