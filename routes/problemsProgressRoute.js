import express from 'express';
import { bookmarkController, favController, notesController, problemStatusController } from '../controllers/problemsProgressController.js';
import authenticateToken from '../middlewares/authenticateToken.js';
import { historyController } from '../controllers/historyController.js';
const router = express.Router();

//routing 

router.post("/bookmark", authenticateToken, bookmarkController);
router.post("/favourites", authenticateToken, favController);
router.post("/notes", authenticateToken, notesController);
router.post("/problemStatus", authenticateToken, problemStatusController);
router.post("/recentHistory", authenticateToken, historyController)

export default router;