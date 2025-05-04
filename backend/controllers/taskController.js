
const {
  getTaskById,
  getAllTasksToMe,
  getAllTasksByMe,
  updateTask,
  createTask,
  deleteTask,
} = require("../services/taskServices.js");

const getTask = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (task.err) {
      return res.status(404).json({ message: task.message });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasksToMe = async (req, res) => {
  try {
    const tasks = await getAllTasksToMe(req.user.id);
    if (tasks.err) {
      return res.status(404).json({ message: tasks.message });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasksByMe = async (req, res) => {
  try {
    const tasks = await getAllTasksByMe(req.user.id);
    if (tasks.err) {
      return res.status(404).json({ message: tasks.message });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTasks = async (req, res) => {
  try {
    const taskData = req.body;
    const task = await createTask(taskData);
    if (task.err) {
      return res.status(400).json({ message: task.message });
    }
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTasks = async (req, res) => {
  try {
    const taskData = req.body;
    const task = await updateTask(req.params.id, taskData);
    if (task.err) {
      return res.status(400).json({ message: task.message });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTasks = async (req, res) => {
  try {
    const task = await deleteTask(req.params.id);
    if (task.err) {
      return res.status(400).json({ message: task.message });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTask,
  getTasksToMe,
  getTasksByMe,
  createTasks,
  updateTasks,
  deleteTasks,
};
