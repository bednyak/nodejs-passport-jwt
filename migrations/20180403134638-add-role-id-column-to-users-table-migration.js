/**
 * Add roleId column to Users table
 */
class Migration {
    up(queryInterface, DataTypes) {
        return queryInterface.addColumn('Users', 'roleId', {
            type: DataTypes.INTEGER,
            allowNull: false
        });
    }

    down(queryInterface, DataTypes) {
        return queryInterface.removeColumn('Users', 'roleId');
    }
}

module.exports = new Migration();
