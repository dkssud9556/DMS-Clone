module.exports = (sequelize, DataTypes) => {
    return sequelize.define('remain', {
        status: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamps: true,
        paranoid: true
    });
};
