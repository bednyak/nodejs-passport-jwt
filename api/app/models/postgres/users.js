/**
 * Users
 * @param sequelize
 * @param DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roleId: {
            type: DataTypes.INTEGER,
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

    Users.associate = db => {
        Users.hasMany(db.ResetPasswords, { foreignKey: 'userId' });
        Users.hasOne(db.UserCredentials, { foreignKey: 'userId' });
        Users.belongsTo(db.RoleDescriptions, { foreignKey: 'roleId' });
        Users.hasMany(db.UserDescriptions, { foreignKey: 'userId' });
    };

    return Users;
};
