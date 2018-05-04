/**
 * Reset password
 * @param sequelize
 * @param DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    const ResetPasswords = sequelize.define('ResetPasswords', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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

    ResetPasswords.associate = db => {
        ResetPasswords.belongsTo(db.Users, { foreignKey: 'userId' });
    };

    return ResetPasswords;
};
