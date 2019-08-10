const express = require('express');
const router = express.Router();
const {User, Music, Remain} = require('../models');
const passport = require('passport');
const {isNotLoggedIn, isLoggedIn} = require('./middlewares');

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login', {
        loginError:req.flash('loginError')
    });
});

router.get('/join', isNotLoggedIn,(req, res) => {
    res.render('join', {
        joinError:req.flash('joinError')
    });
});

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const {username, realname, password, repassword} = req.body;
    try {
        const user = await User.findOne({where:{username}});
        if(user) {
            req.flash('joinError', '이미 존재하는 아이디입니다.');
            return res.redirect('/auth/join');
        }
        if(password !== repassword) {
            req.flash('joinError', '비밀번호를 알맞게 입력하세요.');
            return res.redirect('/auth/join');
        }
        const newUser = await User.create({
            username,
            realname,
            password
        });
        await Remain.create({
            userId:newUser.id
        });
        await Music.create({
            userId:newUser.id
        });
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/login', isNotLoggedIn, async (req, res, next) => {
    passport.authenticate('local', async (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user) {
            req.flash('loginError', info.message);
            return res.redirect('/auth/login');
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/change', isLoggedIn, (req, res) => {
    res.render('change', {
        changeError:req.flash('changeError')
    });
});

router.put('/change', isLoggedIn, async (req, res, next) => {
    const {now, after, re} = req.body;
    try {
        const user = await User.findOne({where:{id:req.user.id}});
        if(user.password !== now) {
            req.flash('changeError', '현재 비밀번호가 틀렸습니다.');
            return res.redirect('/auth/change');
        }
        if(after !== re) {
            req.flash('changeError', '비밀번호가 일치하지 않습니다.');
            return res.redirect('/auth/change');
        }
        await User.update({password:after}, {where:{id:req.user.id}});
        res.redirect('/');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;
