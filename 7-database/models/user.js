const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        //테이블의 컬럼 정의
        return super.init({
            name:{
                type:Sequelize.STRING(20),
                allowNull:false,
                unique:true,
            },
            age:{
                type:Sequelize.INTEGER.UNSIGNED,
                allowNull:false,
            },
            married:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
            },
            comment:{
                type:Sequelize.TEXT,
                allowNull:true,
            },
            created_at:{
                type:Sequelize.DATE, // mySQL의 DATETIME -> DATE / DATE -> DateOnly
                allowNull:false,
                defaultValue:Sequelize.NOW,
            }
        },{
            sequelize,
            timestamps:false, //true 주면 createdAt, updatedAt이 자동으로 추가됨
            underscored:false, //컬럼명에 _ 넣을지 말지
            paranoid:false, // true면 deletedAt도 추가됨 -- soft delete
            modelName:'User',
            tableName:'users', //안정해주면 model명의 복수형으로 들어감
            charset:'utf8',
            collate:'utf8_general_ci'
        });
    }

    static associate(db){
        db.User.hasMany(db.Comment, {foreignKey:'commenter', sourceKey:'id'})
    }
}