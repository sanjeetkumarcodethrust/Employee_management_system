import express from 'express';
import { createTask, updateStatus } from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTask);
router.patch('/status', updateStatus);

export default router;
