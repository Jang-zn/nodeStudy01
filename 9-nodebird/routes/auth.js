const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
// const {isLoggedIn, inNotLoggedIn} = require('./middlwares');
const User = require('../models/user');

const router = express.Router();

router.post('/join', async (req, res, next)=>{
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
        return res.redirect('/');
    }catch(err){
        console.log(err);
        next(err);
    }
});