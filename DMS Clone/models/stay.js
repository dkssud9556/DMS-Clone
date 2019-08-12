module.exports = (sequelize, DataTypes) => {
    return sequelize.define('stay', {
        status: {
            type:DataTypes.STRING(10),
            allowNull:false,
            defaultValue:'잔류'
        }
    });
};
