const roles = require('./data/roles.json');
/**
 * Set roles default variables to RoleDescriptions table
 */
class Migration {
    up(queryInterface, DataTypes) {
        return queryInterface.bulkInsert('RoleDescriptions', roles);
    }

    down(queryInterface, DataTypes) {
        return queryInterface.bulkDelete('RoleDescriptions', {});
    }
}

module.exports = new Migration();
