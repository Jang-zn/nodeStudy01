const request = require('supertest');
const {sequelize} = require('../models');
const app = require('../app');

//테스트 전에 테이블 생성
beforeAll(async ()=>{
    await sequelize.sync();
})

describe('Post /join', ()=>{
    test('신규가입', (done)=>{
        request(app)
        .post('/auth/join')
        .send({
            email:'test2@naver.com',
            nick:'test2',
            password:'123456'
        })
        .expect('Location', '/')
        .expect(302, done);
    });
});


describe('Post /login', ()=>{
    test('Login', (done)=>{
        request(app)
        .post('/auth/login')
        .send({
            email:'test2@naver.com',
            password:'123456'
        })
        .expect('Location', '/')
        .expect(302, done);
    });
});


//테스트 후 마무리작업 (테스트환경 초기화같은것들)
afterAll( async ()=>{
    //db 초기화
    await sequelize.sync({force:true});
});
