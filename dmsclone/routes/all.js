const express = require('express');
const router = express.Router();
const {User, Remain, Music, sequelize} = require('../models');

router.get('/remain', async (req, res) => {
    const remains = await Remain.findAll({include: [{model:User, required:true}]});
    res.render('allremain', {
        remains
    });
});

router.get('/music', async (req, res) => {
    const musics = await Music.findAll({
        include: [{model:User, required:true}],
        order: sequelize.literal('music.day ASC')
    });
    res.render('allmusic', {
        musics
    });
});

module.exports = router;
