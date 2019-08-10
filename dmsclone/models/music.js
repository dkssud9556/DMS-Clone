module.exports = (sequelize, DataTypes) => {
    return sequelize.define('music', {
        name: {
            type: DataTypes.STRING(32),
            allowNull: true,
        },
        singer: {
            type: DataTypes.STRING(32),
            allowNull: true,
        },
        day: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
        }
    }, {
        timestamps: true,
        paranoid: true
    });
};
