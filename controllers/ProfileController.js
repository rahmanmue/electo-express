import {
  updateProfile,
  getAvatar,
  findProfile,
  updateProfileWithFirebase,
} from "../services/ProfileService.js";

export const getProfileUser = async (req, res) => {
  try {
    const profile = await findProfile(req.cookies.refreshToken);
    res.status(profile.status).json(profile);
  } catch (error) {
    if (error.message === "User not found") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
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
    res.status(updated.status).json(updated);
  } catch (error) {
    if (error.message === "Profile not found") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getImageAvatar = async (req, res) => {
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
          res.status(error.status).json({ message: error.message });
        } else {
          res.status(500).json({ message: error.message });
        }
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfileFirebase = async (req, res) => {
  try {
    const data = {
      user_id: req.body.userId,
      full_name: req.body.full_name,
      avatar: req.file ?? null,
    };

    const updated = await updateProfileWithFirebase(data);
    res.status(updated.status).json(updated);
  } catch (error) {
    if (error.message === "Profile not found") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};
