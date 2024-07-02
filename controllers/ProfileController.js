import {
  updateProfile,
  getAvatar,
  findProfile,
} from "../services/ProfileService.js";

export const getProfileUser = async (req, res) => {
  try {
    const profile = await findProfile(req.cookies.refreshToken);
    res.status(profile.status).json(profile.data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProfileUser = async (req, res) => {
  try {
    const data = {
      user_id: req.body.userId,
      full_name: req.body.full_name,
      avatar: req.file ? req.file.filename : null,
    };

    const updated = await updateProfile(data);
    res.status(updated.status).json(updated.message);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getImageAvatar = async (req, res) => {
  try {
    getAvatar(req.params.avatar)
      .then((data) => {
        res.writeHead(data.status, {
          "Content-Type": "image/png",
          "Content-Length": data.length,
        });
        res.end(data.data);
      })
      .catch((error) => {
        if (error.status === 404) {
          res.status(error.status).json({ msg: error.message });
        } else {
          res.status(500).json({ msg: error.message });
        }
      });
  } catch (error) {
    res.status(500).json({ msg: error.message });
    console.log(error);
  }
};
