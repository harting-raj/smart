import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();
import taskController from '../controllers/task.controller.js';

router.post('/additem',taskController.addItemTask)

export default router