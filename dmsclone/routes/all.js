const express = require('express');
const router = express.Router();
const {User, Remain, Music, sequelize} = require('../models');

router.get('/remain', async (req, res, next) => {
    try {
        const remains = await Remain.findAll({include: [{model: User, required: true}]});
        res.status(200).render('allremain', {
            remains,
            user1:req.user
        });
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/music', async (req, res, next) => {
    try {
        const musics = await Music.findAll({
            include: [{model: User, required: true}],
            order: sequelize.literal('music.day ASC')
        });
        res.status(200).render('allmusic', {
            musics,
            user1:req.user
        });
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;
