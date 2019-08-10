const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Remain = require('./remain')(sequelize, Sequelize);
db.Music = require('./music')(sequelize, Sequelize);
db.User.hasOne(db.Remain, {foreignKey:'userId', sourceKey:'id'});
db.Remain.belongsTo(db.User, {foreignKey:'userId', sourceKey:'id'});
db.User.hasOne(db.Music, {foreignKey:'userId', sourceKey:'id'});
db.Music.belongsTo(db.User, {foreignKey:'userId', sourceKey:'id'});

module.exports = db;
