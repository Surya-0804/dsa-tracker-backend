import express from 'express';
import { leetCodeStats, gfgStats } from '../controllers/userStatsController.js';
import authenticateToken from '../middlewares/authenticateToken.js';
const router = express.Router();

router.post("/leetcodeStats", authenticateToken, leetCodeStats);
router.post("/gfgStats", authenticateToken, gfgStats)
export default router;