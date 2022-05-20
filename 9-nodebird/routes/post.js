const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {Post, Hashtag} = require('../models');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

try{
    fs.readdirSync('uploads');
}catch(e){
    console.error("upload 폴더가 없어 폴더 생성");
    fs.mkdirSync('uploads');
}

//multer 세팅
const upload = multer({
    storage:multer.diskStorage({
        destination(req, file, cb){
            cb(null, 'upload/');
        },
        filename(req, file, cb){
            //확장자
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext)+Date.now()+ext);
        }
    }),
    limits:{fileSize : 5*1024*1024},
});


router.post('/img', isLoggedIn, upload.single('img'), (req, res)=>{
    console.log(req.file);
    res.json({
        url:`/img/${req.file.filename}`
    });
});

router.post('/', isLoggedIn, upload.none(),async (req, res, next)=>{
    try{
        const post = await Post.create({
            content : req.body.content,
            img:req.body.url,
            UserId:req.user.id,
        });

        //정규표현식으로 해시태그 골라내기
        //아래처럼 하면 {{해시태그, false}, {해시태그, true}} 형태로 있으면 false, 없으면 true 주는 2차원배열 형태로 나옴
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if(hashtags){
            const result = await Promise.all(
                hashtags.map(tag=>{
                    return Hashtag.findOrCreate({
                        where:{title:tag.slice(1).toLowerCase()},
                    });
                })
            );
            await post.addHashtags(result.map(r=>r[0]) );
        }
        res.redirect('/');
    }catch(e){
        console.error(e);
        next(e);
    }
});


// const upload2 = multer();
// router.post('/', isLoggedIn, (req, res, next)=>{
//     try{
//         const post = await Post.create({
//             content : req.body.content,
//             img:req.body.url,
//             UserId:req.user.id,
//         });

//         const hashtags = req.body.content.match(/#[^%\s#]*g);

//         if(hashtags){
//             const result = await Promise.all(
//                 hashtags.map(tag=>{
//                     return Hashtag.findOrCreate({
//                         where:{title:tag.slice(1).toLowerCase()},
//                     })
//                 }),
//             )
//             await post.addHashtags(result.map(r=>r[0]));
//         }
//     }catch(e){
        
//     }
// });

module.exports = router;