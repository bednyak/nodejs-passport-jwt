/**
 * Create Reset Password table
 */
class Migration {
    up(queryInterface, DataTypes) {
        return queryInterface.createTable('ResetPasswords', {
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
    }

    down(queryInterface, DataTypes) {
        return queryInterface.dropTable('ResetPasswords');
    }
}

module.exports = new Migration();
