const router = require('express').Router();
const {isLoggedIn} = require('./middlewares');
const {User, Stay, Music} = require('../models');
const sequelize = require('../models').Sequelize;

router.post('/stay', isLoggedIn, async (req, res, next) => {
    const {status} = req.body;
    try {
        if(status !== '잔류' && status !== '금요귀가' && status !== '토요귀가' && status !== '토요귀사') {
            return res.status(400).json({message:'입력값이 잘못되었습니다. (잔류, 금요귀가, 토요귀가, 토요귀사)', code:422});
        }
        await Stay.update({status}, {where:{id:req.user.id}});
        res.status(201).json({message:`${status} 신청 완료`, code:201});
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/my-stay', isLoggedIn, async (req, res, next) => {
    try {
        const stay = await Stay.findOne({where: {userId: req.user.id}});
        res.status(200).json({stay:stay.status, code:200});
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/music', isLoggedIn, async (req, res, next) => {
    const {song, singer, day} = req.body;
    if(day !== '월' && day !== '화' && day !== '수' && day !== '목' && day !== '금') {
        return res.status(400).json({message:'요일을 잘못 입력했습니다.(월, 화, 수, 목, 금)', code:400});
    }
    try {
        const today = await Music.findAll({where:{day}});
        if(today.length >= 5) {
            return res.status(409).json({message:'해당 요일은 신청이 꽉찼습니다.', code:409});
        }
        const myMusic = await Music.findOne({where:{userId:req.user.id}});
        if(myMusic) {
            return res.status(409).json({message:'이미 기상음악을 신청했습니다.', code:409})
        }
        await Music.create({song, singer, day, userId:req.user.id});
        res.status(201).json({message:'기상음악 신청 성공', code:201, song, singer, day});
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/my-music', isLoggedIn, async (req, res, next) => {
    try {
        const music = await Music.findOne({where:{userId:req.user.id}});
        if(!music) {
            return res.status(404).json({message:'기상음악을 신청해보세요.', code:404});
        }
        res.status(200).json({message:'기상음악조회 성공', code:200 ,song:music.song, singer:music.singer, day:music.day});
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/all-stay', async (req, res, next) => {
    try {
        const stay = await User.findAll({
            include: [{model:Stay, required:true, attributes: ['status']}],
            attributes: ['realname', 'username']
        });
        res.status(200).json({stay});
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/all-music', async (req, res, next) => {
    try {
        const musics = await User.findAll({
            include: [{model:Music, required:true, attributes: ['song', 'singer', 'day']}],
            attributes: ['username', 'realname']
        });
        if(musics.length === 0) {
            return res.status(404).json({message:'신청된 음악이 없습니다.', code:404});
        }
        res.status(200).json({musics});
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;
