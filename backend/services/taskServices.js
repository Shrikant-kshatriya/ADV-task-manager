const Task = require('../models/Task.js');

const getTaskById = async (id) => {
    try {
        const task = await Task.findById(id);
        if (!task) {
            throw new Error('Task not found');
        }
        return task;
        
    } catch (err) {
        return { err, message: err.message };
    }
}

const getAllTasksToMe = async (id) => {
    try {
        const tasks = await Task.find({ assignedTo: id });
        return tasks;
    } catch (err) {
        return { err, message: err.message };
    }
}

const getAllTasksByMe = async (id) => {
    try {
        const tasks = await Task.find({ assignedBy: id });
        return tasks;
    } catch (err) {
        return { err, message: err.message };
    }
}

const createTask = async (taskData) => {
    try {
        const task = new Task(taskData);
        if (!task) {
            throw new Error('Task not created');
        }
        await task.save();
        return task;
    } catch (err) {
        return { err, message: err.message };
    }
}

const updateTask = async (id, taskData) => {
    try {
        const task = await Task.findByIdAndUpdate(id, taskData, { new: true });
        if (!task) {
            throw new Error('Task cannot be updated');
        }
        return task;
    }
    catch (err) {
        return { err, message: err.message };
    }
}
const deleteTask = async (id) => {
    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            throw new Error('Task cannot be deleted');
        }
        return task;
    } catch (err) {
        return { err, message: err.message };
    }
}

module.exports = {
    getTaskById,
    getAllTasksToMe,
    getAllTasksByMe,
    createTask,
    updateTask,
    deleteTask
}