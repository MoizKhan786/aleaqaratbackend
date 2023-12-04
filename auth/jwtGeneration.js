const jwt = require("jsonwebtoken");

// This function helps to a generate an access token using users email.
const generateAccessToken = (email, username) => {
  const accessToken = jwt.sign({ email, username }, "Moiz@786", {
    expiresIn: "1h",
  });
  return accessToken;
};

// This function helps to a verify access token using the token provided.
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, "Moiz@786");
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
};
