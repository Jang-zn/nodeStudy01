const Sequelize = require('sequelize');
const User = require('./user');
const config = require('../config/config.json')['test'];
//config에서 test 환경의 정보를 가져오도록 설정
const sequelize = new Sequelize(config.database, config.username, config.password, config);


describe('User 모델',()=>{
    test('static init call', ()=>{ 
        expect(User.init(sequelize)).toBe(User);
    });
    test('static associate call', ()=>{
        const db = {
            User:{
                hasMany:jest.fn(),
                belongsToMany:jest.fn(),
            },
            Post:{},
        };
        User.associate(db);
        expect(db.User.hasMany).toBeCalledWith(db.Post);
        expect(db.User.belongsToMany).toBeCalledTimes(2);
    });
});