const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/userModel");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_Client_ID,
    clientSecret: process.env.GOOGLE_Client_secret,
    callbackURL: "http://localhost:3200/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      let user = await userModel.findOne({ googleId: profile.id });

      if (!user) {
        user = new userModel({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id
        });

        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
