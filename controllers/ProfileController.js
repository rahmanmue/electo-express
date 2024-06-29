import { updateProfile, getAvatar } from "../services/profileService.js";

export const updateProfileUser = async (req, res) => {
  try {
    const data = {
      user_id: req.body.userId,
      full_name: req.body.full_name,
      avatar: req.file ? req.file.filename : null,
    };

    await updateProfile(data);
    res.status(200).json({ msg: "Profile updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getImageAvatar = async (req, res) => {
  try {
    getAvatar(req.params.avatar)
      .then((data) => {
        res.writeHead(200, {
          "Content-Type": "image/png",
          "Content-Length": data.length,
        });
        res.end(data);
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
