const Sequelize = require('sequelize');

module.exports=class Comment extends Sequelize{
    static init(sequelize){
        return super.init({
            comment:{
                type:Sequelize.STRING(100),
                allowNull:false,
            },
            created_at:{
                type:Sequelize.DATE,
                allowNull:false,
                defaultValue:Sequelize.NOW,
            },
        },{
            sequelize,
            timestamp:false,
            paranoid:false,
            modelName:'Comment',
            tableName:'comments',
            charset:'utf8',
            collate:'utf8mb4_general_ci'
        });
    }

    static associate(db){
        db.Comment.belongsTo(db.User, {foreignKey:'commenter', targetKey:'id', onDelete:'cascade', onUpdate:'cascade'})
    }
}