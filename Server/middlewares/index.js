var { expressjwt : jwt} = require("express-jwt");

export const requireSignin = jwt({
  getToken: (req, res) => req.cookies.token,
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});