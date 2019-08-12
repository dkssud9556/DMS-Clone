module.exports = (sequelize, DataTypes) => {
    return sequelize.define('music', {
        song: {
            type:DataTypes.STRING(32),
            allowNull:false
        },
        singer: {
            type:DataTypes.STRING(32),
            allowNull:false
        },
        day: {
            type:DataTypes.STRING(10),
            allowNull:false
        }
    });
};
