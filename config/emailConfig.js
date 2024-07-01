import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  // host: "smtp.gmail.com",
  // port: 465,
  // secure: false,
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASS,
  },
});

export default transporter;
