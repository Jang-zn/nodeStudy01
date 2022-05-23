const {addFollowing} = require('./user');

describe('addFollwing', ()=>{
    const res = {
        send : jest.fn(),
        status : jest.fn(()=>res),
    }
    const next = jest.fn();


    test('사용자 조회 후 팔로잉 추가, success 응답', async ()=>{
        const req = {
            user : {
                id:1
            }
        };

        await addFollwing (req, res, next);
        expect(res.send).toBeCalledWith('success');
    });


    test('사용자 조회 후 사용자 없으면 status 404, send no user', async ()=>{
        const req = {
            user : {
                id:999
            }
        };

        await addFollwing (req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user')
    });

    test('DB에러는 next(error)', async ()=>{
        const req = {
            user : {}
        };

        await addFollwing (req, res, next);
        expect(next(error)).toBeCalledTimes(1);  
    });
})