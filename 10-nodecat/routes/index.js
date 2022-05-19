const express = require('express');
const axios = require('axios');

const router = express.Router();


//토큰 테스트
router.get('/test', async (req, res, next)=>{
    try{
        if(!req.session.jwt){ //토큰이 없는경우 발급 시도 (api서버)
            const tokenResult = await axios.post('http://localhost:8002/v1/token',{
                clientSecret : process.env.CLIENT_SECRET,
            });
            if(tokenResult.data && tokenResult.data.code === 200){ //발급 성공
                req.session.jwt = tokenResult.data.token; //세션에 토큰정보 저장
            }else{
                return res.json(tokenResult.data); //발급 실패
            }
        }
        //토큰 테스트
        const result = await axios.get('http://localhost:8002/v1/test',{
            headers : {authorization : req.session.jwt},

        });
        return res.json(result.data);
    }catch(e){
        console.log('here');
        console.error(e);
        if(e.response.status===419){
            return res.json(res.data);
        }
        return next(e);
    }
});



module.exports=router;