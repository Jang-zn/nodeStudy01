// test('테스트 설명', ()=>{
//      테스트 로직
// }); 형태로 작성함

//isLoggedIn, isNotLoggedIn 두개 함수를 테스트한다. → '단위'별 테스트라서 단위테스트(UnitTest)
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

describe('isLoggedIn', ()=>{
    //Mocking - 더미데이터로 테스트 - 주로 단위테스트에서 사용함
    const res = {
        status:jest.fn(()=>res),
        send:jest.fn(),
    };
    const next = jest.fn();


    test('로그인된 경우 isLoggedIn이 next 호출', ()=>{
        const req = {
            isAuthenticated : jest.fn(()=>true),
        };
        isLoggedIn(req, res, next)
        expect(next).toBeCalledTimes(1);
    });


    test('로그인 안된 경우 isLoggedIn이 에러 응답', ()=>{
    const req = {
        isAuthenticated : jest.fn(()=>false),
    };
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인이 필요합니다.');
    });
});


describe('isNotLoggedIn', ()=>{
    const res = {
        status:jest.fn(()=>res),
        send:jest.fn(),
        redirect : jest.fn(),
    };
    const next = jest.fn();

    test('로그인된 경우 isNotLoggedIn이 에러 응답', ()=>{
        const req = {
            isAuthenticated : jest.fn(()=>true),
        };
        isNotLoggedIn(req, res, next);
        const message = encodeURIComponent('이미 로그인이 되었습니다.');
        expect(res.redirect).toBeCalledWith(`/error=${message}`);
    });
    
    test('로그인 안된 경우 isNotLoggedIn이 next 호출', ()=>{
        const req = {
            isAuthenticated : jest.fn(()=>false),
        };
        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
});