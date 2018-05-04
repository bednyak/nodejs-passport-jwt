/**
 * Create UserCredentials table
 */
class Migration {
    up(queryInterface, DataTypes) {
        return queryInterface.createTable('UserCredentials', {
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
    }

    down(queryInterface, DataTypes) {
        return queryInterface.dropTable('UserCredentials');
    }
}

module.exports = new Migration();
