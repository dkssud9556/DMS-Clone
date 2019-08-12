exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        //401:권한 없음
        res.status(401).json({message:'로그인이 필요합니다.', code:401});
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        //412:사전조건 실패
        res.status(412).json({message:'로그아웃 해야 합니다.', code:412});
    }
};
