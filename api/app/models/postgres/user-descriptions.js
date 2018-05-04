/**
 * UserDescriptions
 * @param sequelize
 * @param DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    const UserDescriptions = sequelize.define('UserDescriptions', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING
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

    UserDescriptions.associate = db => {
        UserDescriptions.belongsTo(db.Users, { foreignKey: 'userId' });
    };

    return UserDescriptions;
};
