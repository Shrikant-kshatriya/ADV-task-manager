const User = require('../models/User.js');
const { getUser, getUsersByRole } = require('../services/userServices');

const getSingleUser = async (req, res) => {
    try{
    const user = await getUser(req.user.id);
    if(user.err){
        return res.status(404).json({ message: user.message });
    }
    res.status(200).json(user);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
}

const getAllUser = async (req, res) => {
    const user = await getUser(req.user.id);
    const role = user.role;
    try{
        const users = await getUsersByRole(role);
        if(users.err){
            return res.status(404).json({ message: users.message });
        }
        res.status(200).json(users);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getSingleUser,
    getAllUser
}