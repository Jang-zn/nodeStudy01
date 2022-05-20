const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

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
}

exports.verifyToken = (req, res, next)=>{
    try{
        //보통 header의 authorization에 인증을 위한 키같은걸 추가함
        //req에 decode 된 data가 담기게 됨.
        console.log(req.headers.authorization)
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
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

exports.apiLimiter = RateLimit({
    //milliseconds 기준, '1분 동안'
    windowMs : 60 * 1000,
    //최대 5회
    max : 5,
    //호출간격 : 1초
    delayMs : 1000,
    hanlder(req, res){
        res.status(this.statusCode).json({ //할당량 소진 = code : 429
            code:this.statusCode,
            message:'1분에 5회 요청할 수 있습니다.'
        })
    }
});

exports.deprecated = (req, res)=>{
    res.status(410).json({
        code:410,
        message:'새로운 버전으로 업데이트 하세요',
    });
}