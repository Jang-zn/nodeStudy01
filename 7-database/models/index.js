const Sequelize = require('sequelize');


//mySQL - node간 연결해주는 코드 (초기화된 sequelize 이용하여 연결)

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db={}

const sequelize = new Sequelize(config.database, config.username, config.password, config);


//
db.sequelize = sequelize;

module.exports = db;