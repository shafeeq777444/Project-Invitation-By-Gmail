const jwt = require("jsonwebtoken");

const generateInviteToken = (projectId) => {
  return jwt.sign({ projectId }, process.env.PROJECT_JWT_SECRET, {algorithm: "HS256", expiresIn: "7d" }).replace(/=/g, ""); // Expires in 7 days
};

const verifyInviteToken = (token) => {
  try {
    return jwt.verify(token, process.env.PROJECT_JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateInviteToken, verifyInviteToken };
