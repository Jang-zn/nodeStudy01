const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).send('로그인이 필요합니다.');
    }
};

exports.isNotLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        next();
    }else{
        const message = encodeURIComponent('이미 로그인이 되었습니다.');
        res.redirect(`/error=${message}`);
    }
};

exports.verifyToken = (req, res, next)=>{
    try{
        //보통 header의 authorization에 인증을 위한 키같은걸 추가함
        req.decoded = jwt.verify(req.headers.authorization, process.env,JWT_SECRET);
        return next();
    }catch(e){
        if(e.name==='TokenExpiredError'){
            return res.status(419).json({ //유효기간 초과
                code:419,
                message : '토큰이 만료되었습니다.',
            });
        }
        return res.status(401).json({ //변조 확인
            code:401,
            message:'유효하지 않은 토큰입니다.',
        });
    }
};