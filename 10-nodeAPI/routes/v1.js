const express = require('express');
const jwt = require('jsonwebtoken');

const {verifyToken} = require('../routes/middlewares');
const {Domain, User, Post, Hashtag} = require('../models');

const router = express.Router();


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