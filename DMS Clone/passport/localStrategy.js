const LocalStrategy = require('passport-local').Strategy;
const User = require('../models').User;

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, async (username, password, done) => {
        try {
            const exUser = await User.findOne({where:{username}});
            if(exUser) {
                if(password === exUser.password) {
                    done(null, exUser);
                } else {
                    done(null, false, {message:'비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, false, {message:'가입되지 않은 회원입니다.'});
            }
        } catch (e) {
            console.error(e);
            done(e);
        }
    }));
};
