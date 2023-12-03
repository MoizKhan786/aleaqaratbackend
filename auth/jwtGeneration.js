const jwt = require("jsonwebtoken");

const generateAccessToken = (email, username) => {
  const accessToken = jwt.sign({ email, username }, "Moiz@786", {
    expiresIn: "1h",
  });
  return accessToken;
};

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
