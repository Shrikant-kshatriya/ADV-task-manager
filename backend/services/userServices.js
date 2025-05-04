const User = require('../models/User.js');

const getUser = async (id) => {
    try{
    const user = await User.findById(id).select('-password');
    if(!user){
        throw new Error('User not found');
    }
    return user;
    } catch(err){
        return {err, message: err.message};
    }
};

const getUsersByRole = async (role) => {
    try {
        let query = {};
        if (role === 'admin') {
            query = {}; // Get all users
        } else if (role === 'manager') {
            query = { role: { $in: ['manager', 'user'] } }; // Get managers and users
        } else if (role === 'user') {
            query = { role: 'user' }; // Get only users
        } else {
            throw new Error('Invalid role');
        }

        const users = await User.find(query).select('-password');
        return users;
    } catch (err) {
        return { err, message: err.message };
    }
};

module.exports = {
    getUser,
    getUsersByRole
}