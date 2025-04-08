import NotFoundError from "../exceptions/NotFoundError.js";
import {
  updateProfile,
  getAvatar,
  findProfile,
  updateProfileWithFirebase,
} from "../services/ProfileService.js";
import AuthValidator from "../validator/AuthValidator.js";
import ProfileValidator from "../validator/ProfileValidator.js";

export const getProfileUser = async (req, res, next) => {
  try {
    AuthValidator.validateRefreshToken(req.cookies);
    const profile = await findProfile(req.cookies.refreshToken);
    res.status(profile.status).json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfileFirebase = async (req, res, next) => {
  try {
    const body = {
      user_id: req.body.userId,
      full_name: req.body.full_name,
      avatar: req.file,
    };

    ProfileValidator.validateProfile(body);

    const updated = await updateProfileWithFirebase(body);
    res.status(updated.status).json(updated);
  } catch (error) {
    next(error);
  }
};

export const updateProfileUser = async (req, res, next) => {
  try {
    const data = {
      user_id: req.body.userId,
      full_name: req.body.full_name,
      avatar: req.file ? req.file.filename : null,
    };

    const updated = await updateProfile(data);
    res.status(updated.status).json(updated);
  } catch (error) {
    next(error);
  }
};

export const getImageAvatar = async (req, res, next) => {
  try {
    getAvatar(req.params.avatar)
      .then((data) => {
        res.writeHead(data.status, {
          "Content-Type": "image/png",
          "Content-Length": data.data.length,
        });
        res.end(data.data);
      })
      .catch((error) => {
        if (error.status === 404) {
          throw new NotFoundError("Image not found");
        } else {
          throw new Error(error.message);
        }
      });
  } catch (error) {
    next(error);
  }
};
