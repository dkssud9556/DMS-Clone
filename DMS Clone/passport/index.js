const local = require('./localStrategy');
const User = require('../models').User;

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({where:{id}});
            done(null, user);
        } catch (e) {
            done(e);
        }
    });
    local(passport);
};
