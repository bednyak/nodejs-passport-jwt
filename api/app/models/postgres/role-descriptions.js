/**
 * RoleDescriptions
 * @param sequelize
 * @param DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    const RoleDescriptions = sequelize.define('RoleDescriptions', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
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

    RoleDescriptions.associate = db => {
        RoleDescriptions.hasMany(db.Users, { foreignKey: 'roleId' });
    };

    return RoleDescriptions;
};
