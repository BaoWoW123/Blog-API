const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { Author } = require("./db");
require("dotenv").config();
const opts = {
  jwtFromRequest: req => req.cookies.jwt,
  secretOrKey: process.env.secretKey,
};
passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await Author.findById(payload.user);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      done(err, false);
    }
  })
);

module.exports = passport;
