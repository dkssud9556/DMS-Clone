exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({message:'로그인이 필요합니다.', code:401});
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        res.status(403).json({message:'로그아웃 해야 합니다.', code:403});
    }
};
