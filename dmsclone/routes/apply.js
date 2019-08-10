const express = require('express');
const router = express.Router();
const {User, Remain, Music} = require('../models');
const {isLoggedIn} = require('./middlewares');

router.get('/', (req, res) => {
    res.status(200).render('apply');
});

router.get('/remain', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {username: req.user.username},
            include: [{model: Remain, required: true}]
        });
        const status = user.remain.status;
        res.status(200).render('remain', {
            status: status === 0 ? '잔류' : status === 1 ? '금요귀가' : status === 2 ? '토요귀가' : '토요귀사'
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/remain', async (req, res, next) => {
    const {status} = req.body;
    try {
        await Remain.update({status}, {where:{userId:req.user.id}});
        res.redirect('/apply/remain');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/music', isLoggedIn, async (req, res, next) => {
    try {
        const music = await Music.findOne({where: {userId: req.user.id}});
        res.status(200).render('music', {
            song: music.name,
            singer: music.singer,
            day: music.day === 0 ? '월' : music.day === 1 ? '화' : music.day === 2 ? '수' : music.day === 3 ? '목' : '금'
        });
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.delete('/music', isLoggedIn, async (req, res, next) => {
    try {
        await Music.update({name:null, singer:null, day:null}, {where:{id:req.user.id}});
        res.redirect('/apply/music');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/music', async (req, res, next) => {
    const {name, singer, day} = req.body;
    try {
        await Music.update({name, singer, day}, {where: {userId: req.user.id}});
        res.redirect('/apply/music');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;
