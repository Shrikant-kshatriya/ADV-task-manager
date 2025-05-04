const User = require('../models/User.js');
const bcrypt = require("bcryptjs");

const registerUser = async (username, email, password, role) => {
    try {
        const newUser = new User({
            username,
            email,
            password,
            role
        });
        await newUser.save();
        return newUser;
    } catch (error) {
        return { message: error.message };
    }
};

const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        if (!password || !user.password) {
            throw new Error('Password is required');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        return {success: true, user};
    } catch (error) {
        return { success: false, error, message: error.message };
    }
};

module.exports = {
    registerUser,
    loginUser
}