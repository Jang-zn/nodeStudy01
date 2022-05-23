const {addFollowing} = require('./user');

//DB Mocking
jest.mock('../models/user');
const User = require('../models/user');

describe('addFollowing', ()=>{
    const req = {
        user : {id:1},
        params:{id:2}
    };
    const res = {
        send : jest.fn(),
        status : jest.fn(()=>res),
    }
    const next = jest.fn();


    test('사용자 조회 후 팔로잉 추가, success 응답', async ()=>{
        //DB 조회시 돌려줄 객체를 mocking으로 지정할 수 있음
        User.findOne.mockReturnValue(Promise.resolve({
            id:1, 
            name:'jang',
            addFollowings(value){
                return true;
            }
        }));
        await addFollowing (req, res, next);
        expect(res.send).toBeCalledWith('success');
    });


    test('사용자 조회 후 사용자 없으면 status 404, send no user', async ()=>{
        User.findOne.mockReturnValue(Promise.resolve(null));
        await addFollowing (req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user')
    });

    test('DB에러는 next(error)', async ()=>{
        const error = 'test error';
        User.findOne.mockReturnValue(Promise.reject(error));
        await addFollowing (req, res, next);
        expect(next).toBeCalledWith(error);
    });
})