const router = require('express').Router();
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {User, Stay, Music} = require('../models');
const crypto = require('crypto');
const passport = require('passport');
require('dotenv').config();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const {username, realname, password, repassword} = req.body;
    try {
        const user = await User.findOne({where:{username}});
        if(user) {
            return res.status(409).json({message:'이미 존재하는 username입니다.', code:409});
        }
        if(password !== repassword) {
            return res.status(400).json({message:'password와 repassword가 다릅니다.', code:400});
        }
        const encrypted = crypto.pbkdf2Sync(password, process.env.SALT, 103219, 64, 'sha512').toString('base64');
        const newUser = await User.create({
            username,
            realname,
            password:encrypted
        });
        await Stay.create({userId:newUser.id});
        res.status(201).json({message:'회원가입 성공', code:201, username, realname, password});
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/login', isNotLoggedIn, async (req, res, next) => {
    passport.authenticate('local', async (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user) {
            return res.status(422).json({message:info.message, code:422});
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                next(loginError);
            }
            return res.status(200).json({message:'로그인 성공', code:200});
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.status(200).json({message:'로그아웃 성공', code:200});
});

router.post('/change', isLoggedIn, async (req, res, next) => {
    const {now, password, repassword} = req.body;
    try {
        const user = await User.findOne({where:{id:req.user.id}});
        const encrypted = crypto.pbkdf2Sync(now, process.env.SALT, 103219, 64, 'sha512').toString('base64');
        if(user.password !== encrypted) {
            return res.status(400).json({message:'현재 비밀번호가 틀렸습니다.', code:400});
        }
        if(password !== repassword) {
            return res.status(400).json({message:'비밀번호와 비밀번호 확인 틀립니다.', code:400});
        }
        const newPW = crypto.pbkdf2Sync(password, process.env.SALT, 103219, 64, 'sha512').toString('base64');
        await User.update({password:newPW}, {where:{id:req.user.id}});
        res.status(201).json({message:'비밀번호 변경 성공', code:201});
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;
