const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports=()=>{
    passport.use(new KakaoStrategy({
        clientID : process.env.KAKAO_ID,
        callbackURL : '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done)=>{ //accessToken, refreshToken은 OAuth2 관련 기능, 실무에서 많이 쓴다. 예제에선 안씀... 
        console.log('kakao profile', profile);
        try{
            //DB에서 가입했나? 찾아보고
            const exUser = await User.findOne({
                where : {snsId : profile.id, provider:'kakao'},
            });
            //있으면 해당 유저정보로 로그인
            if(exUser){
                done(null, exUser);
            //없으면 새로 만들고 로그인처리    
            }else{
                const newUser = await User.create({
                    email : profile._json && profile._json.kakao_account_email,
                    nick : profile.displayName,
                    snsId : profile.id,
                    provider:'kakao',
                });
                done(null, newUser);
            }
        }catch(e){
        }
    }));
}