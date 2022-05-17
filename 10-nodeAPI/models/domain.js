const Sequelize = require('sequelize');

module.exports = class Domain extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            //API 사용할때 등록하는 도메인 (요청 보내는 주소같은거)
            host : {
                type: Sequelize.STRING(80),
                allowNull: false,
            },

            //요금제같은거 적용할때 사용
            type: {
                type:Sequelize.ENUM('free','premium'),
                allowNull:false,
            },

            //API 키 역할
            clientSecret:{
                type : Sequelize.STRING(36),
                allowNull:false,
            }
        }, {
            sequelize,
            timestamps:true,
            paranoid: true,
            modelName:'Domain',
            tableName: 'domains',
        });
    }

    static associate(db){
        db.Domain.belongsTo(db.User);
    }
}