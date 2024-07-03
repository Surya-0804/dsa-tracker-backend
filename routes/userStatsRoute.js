import express from 'express';
import { completeUserStats } from '../controllers/userStatsController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

router.post("/completeUserStats", authenticateToken, completeUserStats);

export default router;