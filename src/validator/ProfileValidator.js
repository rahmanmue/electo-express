import Joi from "joi";
import InvariantError from "../exceptions/InvariantError.js";

// schema
const profileSchema = Joi.object({
  user_id: Joi.string().required(),
  full_name: Joi.string().required(),
  avatar: Joi.object({
    originalname: Joi.string().required(), // Nama asli file
    mimetype: Joi.string()
      .valid(
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/apng",
        "image/avif"
      )
      .required(),
    size: Joi.number().max(5000000).required(),
  }).unknown(),
});

// validator

const ProfileValidator = {
  validateProfile: (payload) => {
    const validationResult = profileSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(
        validationResult.error.message.replace(/['"]/g, "")
      );
    }
  },
};

export default ProfileValidator;
