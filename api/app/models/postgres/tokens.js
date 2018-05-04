/**
 * Tokens
 * @param sequelize
 * @param DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    const Tokens = sequelize.define('Tokens', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    });

    Tokens.associate = db => {
        Tokens.belongsTo(db.Users, { foreignKey: 'userId' });
    };

    return Tokens;
};
