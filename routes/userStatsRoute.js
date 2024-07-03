import express from 'express';
import { userStatsController } from '../controllers/userStatsController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

//routing

router.post("/completeUserStats", authenticateToken, userStatsController);

export default router;