const Task = require('../models/Task.js');
const { createNotification } = require('./notificationServices.js');
const { getUser } = require('./userServices.js');

const getTaskById = async (id) => {
    try {
        const task = await Task.findById(id).populate('assignedBy', 'username');
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
        const tasks = await Task.find({ assignedTo: id }).populate('assignedBy', 'username');
        return tasks;
    } catch (err) {
        return { err, message: err.message };
    }
}

const getAllTasksByMe = async (id) => {
    try {
        const tasks = await Task.find({ assignedBy: id }).populate('assignedBy', 'username');
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
        if(task.assignedTo.toString() !== task.assignedBy.toString()) {  // Avoid notifying self
            // Notify the user assigned to the task
            const assignedByUser = await getUser(task.assignedBy);
            if (!assignedByUser) {
                throw new Error('User not found');
            }
            const notificationData = {
                userId: task.assignedTo, // User to whom the task is assigned
                message: `New task assigned to you by ${assignedByUser.username}: ${task.title}`,
                isRead: false,
            };
            await createNotification(notificationData);
        }
        return task;
    } catch (err) {
        return { err, message: err.message };
    }
}

const updateTask = async (id, taskData) => {
    try {
        const originalTask = await Task.findById(id);
        if (!originalTask) {
            throw new Error('Task not found');
        }
        const task = await Task.findByIdAndUpdate(id, taskData, { new: true });
        if (!task) {
            throw new Error('Task cannot be updated');
        }
        // Notify the user who assigned the task if the task status changes by the assigned user
        if (task.assignedTo.toString() !== task.assignedBy.toString() && task.status !== originalTask.status) {
            const assignedToUser = await getUser(task.assignedTo);
            if (!assignedToUser) {
                throw new Error('User not found');
            }
            const notificationData = {
                userId: task.assignedBy, // User who assigned the task
                message: `Task assigned to ${assignedToUser.username}: ${task.title} is now ${task.status}`,
                isRead: false,
            };
            await createNotification(notificationData);
        }

        // Notify the user who the task is assigned to if the task details is updated by user who assigned the task
        if (task.assignedTo.toString() !== task.assignedBy.toString() && (taskData.title !== originalTask.title || taskData.desc !== originalTask.desc || taskData.dueDate !== originalTask.dueDate || taskData.priority !== originalTask.priority) && taskData.status === originalTask.status) {
            const assignedByUser = await getUser(task.assignedBy);
            if (!assignedByUser) {
                throw new Error('User not found');
            }
            const notificationData = {
                userId: task.assignedTo,
                message: `Task assigned to you by ${assignedByUser.username} has been updated: ${task.title}`,
                isRead: false,
            };
            await createNotification(notificationData);
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