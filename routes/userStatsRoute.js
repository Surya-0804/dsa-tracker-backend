import express from 'express';
import { completeUserStats, topicWiseStats, leaderBoardStats } from '../controllers/userStatsController.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import { fetchHistoryController } from '../controllers/historyController.js';
const router = express.Router();

router.post("/completeUserStats", authenticateToken, completeUserStats);
router.post("/topicWiseStats", authenticateToken, topicWiseStats);
router.post("/completeUserData", authenticateToken, completeUserStats);
router.get("/leaderBoardStats", authenticateToken, leaderBoardStats)
router.get("/fetchAllHistory", authenticateToken, fetchHistoryController)
export default router;