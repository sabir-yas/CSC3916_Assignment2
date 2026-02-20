require('dotenv').config();

var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

    // If token is valid and contains username, allow access
    if (jwt_payload.username) {
        return done(null, jwt_payload);
    } else {
        return done(null, false);
    }

}));

exports.isAuthenticated = passport.authenticate('jwt', { session: false });