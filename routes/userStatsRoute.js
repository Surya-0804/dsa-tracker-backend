import express from 'express';
import { completeUserStats, topicWiseStats } from '../controllers/userStatsController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

router.post("/completeUserStats", authenticateToken, completeUserStats);
router.post("/topicWiseStats", authenticateToken, topicWiseStats);

export default router;