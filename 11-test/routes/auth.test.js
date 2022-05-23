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

    test('가입되지 않은 회원', (done)=>{
        const message = encodeURIComponent('가입되지 않은 회원입니다.');
        request(app)
            .post('/auth/login')
            .send({
                email : 'test3@naver.com',
                password:'123456',
            })
            .expect('Location', `/?loginError=${message}`)
            .expect(302, done);
    });

    test('비밀번호 틀림', (done)=>{
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
        request(app)
            .post('/auth/login')
            .send({
                email : 'test2@naver.com',
                password:'12345678',
            })
            .expect('Location', `/?loginError=${message}`)
            .expect(302, done);
    });

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


describe('GET /logout', ()=>{
    test('로그인 안된경우 403', (done)=>{
        request(app)
        .get('/auth/logout')
        .expect(403, done);
    });

    //agent 만들어놓으면 여러 테스트에 걸쳐서 상태가 유지된다.
    const agent = request.agent(app);

    //로그아웃 전에 로그인 시킴
    //beforeEach로 describe 내의 테스트 전에 항상 실행되도록 함
    beforeEach((done)=>{
        agent
            .post('/auth/login')
            .send({
                email:'test2@naver.com',
                password:'123456'
            })
            .end(done);
    })

    test('로그아웃 실행된 경우', (done)=>{
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
        agent
            .get('/auth/logout')
            .expect('Location', '/')
            .expect(302, done);
    });
});


//테스트 후 마무리작업 (테스트환경 초기화같은것들)
afterAll( async ()=>{
    //db 초기화
    await sequelize.sync({force:true});
});
