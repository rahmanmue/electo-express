import { google } from "googleapis";

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export const oauth2Client = (req) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${protocol}://${req.get("host")}/${process.env.REDIRECT_URI}`
  );
};

export const authorizationUrl = (req) => {
  return oauth2Client(req).generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });
};
