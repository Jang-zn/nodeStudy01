//passport 설정하는 js파일

const passport = require('passport');
//Startegy = 로그인 어떻게 할지 작성해놓은 로직..
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = ()=>{
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        User.findOne({
            where:{id},
            include:[{
                model:User,
                attributes:['id', 'nick'],
                as:'Followers'
            },
            {
                model:User,
                attributes:['id', 'nick'],
                as:'Followings'
            }
        ]
        })
        .then(user=>done(null, user))
        .catch(err=>done(err));
    });

    local();
    kakao();
}