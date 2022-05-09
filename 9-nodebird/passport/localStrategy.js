const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = ()=>{
    passport.use(new LocalStrategy({
        usernameField:'email', //req.body."email" 여기가 일치해야됨
        passwordField:'password', // req.body."password"
    }, async (email, password, done)=>{
        //로그인 분기처리
        try{
            //입력받은 정보로 db 조회
            const exUser = await User.findOne({where:{email}});

            //exUser가 있다면
            if(exUser){
                //해쉬값 비교
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    //같으면 로그인
                    done(null, exUser);
                }else{
                    //다르면 비밀번호 에러
                    done(null, false, {message:'비밀번호가 일치하지 않습니다.'});
                }
            }else{
                //exUser가 없는경우
                done(null, false, {message:'가입되지 않은 회원입니다.'});
            }
        }catch(err){
            console.error(err);
            done(err);
        }
    }));
}