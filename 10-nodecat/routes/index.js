const express = require('express');
const axios = require('axios');
const { response } = require('express');

const router = express.Router();

//default 주소,  origin에 값을 넣어줘야 API에서 등록된 도메인으로부터의 요청인지 확인이 가능함
axios.defaults.headers.origin='http://localhost:4000';

const URL = 'http://localhost:8002/v2';


//기존 발급기능 + 토큰 만료시 재발급
const request = async (req, api)=>{
    try{
        if(!req.session.jwt){ //토큰이 없는경우 발급 시도 (api서버)
            const tokenResult = await axios.post(`${URL}/token`,{
                clientSecret : process.env.CLIENT_SECRET,
            });
                req.session.jwt = tokenResult.data.token; //세션에 토큰정보 저장
        }
        return await axios.get(`${URL}${api}`, {
            headers:{authorization : req.session.jwt}
        });
    }catch(e){
        console.error(e);
        if(e.response.status===419){ //토큰 만료인 경우
            delete req.session.jwt;
            return request(req, api); //발급절차 밟도록 request를 재호출해준다
        }
        return e.response;
    }
};


router.get('/mypost', async (req, res, next)=>{
    try{
        const result = await request(req, '/posts/my');
        res.json(result.data);
    }catch(e){
        console.error(e);
        next(e);
    }
});

router.get('/search/:hashtag', async (req, res, next)=>{
    try{
        const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
        res.json(result.data);
    }catch(e){
        console.error(e);
        next(e);
    }
});

//예제라서 프론트로 키 보내주는건데, 실무에서 이러면 자살행위라고 한다.
router.get('/', (req, res)=>{
    res.render('main', {key:process.env.CLIENT_SECRET});
})


module.exports=router;