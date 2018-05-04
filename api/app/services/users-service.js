const DaoFactory = require('../dao'),
    DatabaseError = require('../errors/database-error'),
    ServerError = require('../errors/server-error'),
    userMapper = require('../mappers/user-mapper');

/**
 * User service
 * @class UserService
 */
class UserService {
    constructor() {
        this._userDao = DaoFactory.loadDao('user-dao');
        this._userDescriptionsDao = DaoFactory.loadDao('user-descriptions-dao');
        this._roleDescriptionsDao = DaoFactory.loadDao('role-descriptions-dao');
    }

    /**
     * Get user profile info
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    getUserProfile(params) {
        let userProfile = {};
        return this._userDescriptionsDao
            .getUserDescription({
                userId: params.userId
            })
            .then(userDesc => {
                userProfile.userDesc = userDesc;
                return this._roleDescriptionsDao.getRoleDescriptionById(params.roleId);
            })
            .then(roleDesc => {
                userProfile.roleDesc = roleDesc;
                return userMapper.getUserProfileToResponse(userProfile);
            })
            .catch(err => {
                throw new DatabaseError(err);
            });
    }

    /**
     * Update user profile info
     * @param {Object} params
     * @return {Promise.<Object>}
     */
    updateUserProfile(params) {
        let updatedUserProfile = {};
        return this._roleDescriptionsDao
            .getRoleDescription({
                name: params.role
            })
            .then(roleDesc => {
                if (!roleDesc)
                    throw new ServerError(
                        'Role with such name is un-existed',
                        422,
                        'Update user error',
                        'set new role',
                        'role'
                    );

                updatedUserProfile.roleDesc = roleDesc;
                return this._userDao.updateUser(
                    {
                        id: params.userId
                    },
                    {
                        roleId: roleDesc.id
                    }
                );
            })
            .then(user => {
                updatedUserProfile.user = user;
                return this._userDescriptionsDao.updateUserDescription(
                    {
                        userId: params.userId
                    },
                    {
                        firstName: params.firstName,
                        lastName: params.lastName,
                        email: params.email,
                        title: params.title,
                        companyId: params.companyId,
                        phoneNumberWork: params.phoneNumber
                    }
                );
            })
            .then(userDesc => {
                updatedUserProfile.userDesc = userDesc;
                return userMapper.updateUserProfileToResponse(updatedUserProfile);
            })
            .catch(err => {
                throw err;
            });
    }
}

module.exports = new UserService();
