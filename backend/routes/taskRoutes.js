const express = require('express');
const { getTask, getTasksByMe, getTasksToMe, createTasks, updateTasks, deleteTasks } = require('../controllers/taskController');
const router = express.Router();

router.get('/to-me', getTasksToMe);
router.get('/by-me', getTasksByMe);
router.get('/:id', getTask);
router.post('/', createTasks);
router.patch('/:id', updateTasks);
router.delete('/:id', deleteTasks);

module.exports = router;