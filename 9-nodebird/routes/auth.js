const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {isLoggedIn, inNotLoggedIn} = require('./middlwares');
const User = require('../models/user');

const router = express.Router();

//가입신청
// isNotLoggedIn 미들웨어를 호출해서 true여야 진행되도록 함
router.post('/join', isNotLoggedIn,async (req, res, next)=>{
    //request body에 담겨져 온 가입 form 정보 확인
    const {email, nick, password} = req.body;

    try{
        //중복 유저 검사 (이메일 중복체크)
        const exUser = await User.findOne({where:{email}});
        if(exUser){
            return res.redirect('/join?error=exist');
        }
        //비밀번호 암호화(해쉬화) 후 저장
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password:hash,
        });
        //홈으로 보냄
        return res.redirect('/');
    }catch(err){
        console.error(err);
        next(err);
    }
});

//로그인
router.post('/login', isNotLoggedIn,(req, res, next)=>{
    //localStrategy를 찾음...index에서 등록해놓은 local을 찾는것
    passport.authenticate('local', (authError, user, info)=>{ //Strategy의 (error, User/false, message)에 대응되는 매개변수
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/?loginError=${info.message}`);
        }
        //req.login 하는순간 passport index의 passport.serializeUser 실행됨
        return req.login(user, (loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
        //미들웨어 확장패턴의 내부 미들웨어에는 (req, res, next)를 끝에 붙여준다.
    })(req, res, next);
});

//로그아웃
router.get('/logout', isLoggedIn, (req, res)=>{
    //생성되었던 세션쿠키 삭제
    req.logOut();
    //세션정보 삭제
    req.session.destroy();
    //홈으로 보냄
    res.redirect('/');
});


module.exports=router;