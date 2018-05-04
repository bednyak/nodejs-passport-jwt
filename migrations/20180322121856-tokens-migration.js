/**
 * Create Tokens table
 */
class Migration {
    up(queryInterface, DataTypes) {
        return queryInterface.createTable('Tokens', {
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
    }

    down(queryInterface, DataTypes) {
        return queryInterface.dropTable('Tokens');
    }
}

module.exports = new Migration();
