const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');


const {verifyToken, apiLimiter} = require('./middlewares');
const {Domain, User, Post, Hashtag} = require('../models');
const { urlencoded } = require('express');

const router = express.Router();
router.use(apiLimiter);

//미들웨어 확장패턴으로 cors 적용
//이 경우 validation 분기처리 등을 하기 수월해짐
router.use(async (req, res, next)=>{
    const domain = await Domain.findOne({
        where:{
            //optional chaining ?. 연산자 → 객체 있으면 .으로 접근하고 없으면 undefined 처리
            //dart의 ?.하고 같은거라고 보면 됨
            host:urlencoded.pars(req.get('origin'))?.host
        }
    });
    if(domain){
        cors({
            origin:true,
            credentials:true,
        })(req, res, next);        
    }else{
        next();
    }
});


//토큰 발급용 라우터
router.post('/token', async (req, res)=>{
    const {clientSecret} = req.body;
    try{
        const domain = await Domain.findOne({
            where:{
                clientSecret
            },
            include:{
                model:User,
                attribute:[
                    'nick', 'id'
                ],
            }
        });
        if(!domain){
            return res.status(401).json({
                code:401,
                message:'등록되지 않은 도메인입니다. 도메인을 등록하세요'
            });
        }
        const token = jwt.sign({
            id:domain.User.id,
            nick:domain.User.nick,
        }, process.env.JWT_SECRET, {
            //토큰 유효기간 (1분)
            expiresIn:'1m',
            //토큰 발급자 정보
            issuer:'nodebird'
        });

        // //CORS 해결을 위해 헤더에 추가
        // // * 넣으면 모든 url에 대해 요청을 허가한다는 의미
        // // 아니면 도메인값 넣어줘도 됨
        // res.setHeader('Access-Control-Allow-Origin', '*');
        // //쿠키를 주고받기 위해 허용해줘야 함
        // res.setHeader('Access-Control-Allow-Credentials', 'true');
        //→ 근데 이러면 귀찮으니 cors 패키지를 사용한다.


        return res.json({
            code:200,
            message:'토큰이 발급되었습니다.',
            token,
        });
    }catch(e){
        console.error(e);
        return res.status(500).json({
            code:500,
            message:'서버에러',
        });
    }
});

//토큰 테스트
router.get('/test', verifyToken, (req, res)=>{
    return res.json(req.decoded); 
});


//자신의 포스팅 가져오는 라우트
router.get('/posts/my', verifyToken, (req, res)=>{
    console.log(`userId : ${req.decoded.id}`);
    Post.findAll({where:{userId:req.decoded.id}}).then((posts)=>{
        res.json({
            code:200,
            payload: posts,
        });
    }).catch((err)=>{
        console.error(err);
        return res.status(500).json({
            code:500,
            message:'서버에러',
        });
    });
});

//해시태그로 검색
router.get('/posts/hashtag/:title', verifyToken, async (req, res)=>{
    try{
        const hashtag = await Hashtag.findOne({where:{title:req.params.title}});
        if(!hashtag){
            return res.status(404).json({
                code:404,
                message:'검색 결과가 없습니다.',
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code:200,
            payload:posts,
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({
            code:500,
            message:'서버에러',
        });
    }
});




module.exports=router;