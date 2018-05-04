/**
 * UserCredentials
 * @param sequelize
 * @param DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    const UserCredentials = sequelize.define('UserCredentials', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING,
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

    UserCredentials.associate = db => {
        UserCredentials.belongsTo(db.Users, { foreignKey: 'userId' });
    };

    return UserCredentials;
};
