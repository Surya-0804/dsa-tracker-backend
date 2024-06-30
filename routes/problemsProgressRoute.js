import express from 'express';
import { bookmarkController, favController, notesController, solvedProblemsController, revisionProblemsController } from '../controllers/problemsProgressController.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

//routing 

router.post("/bookmark", authenticateToken, bookmarkController);
router.post("/favourites", authenticateToken, favController);
router.post("/notes", authenticateToken, notesController);
router.post("/solvedProblems", authenticateToken, solvedProblemsController);
router.post("/revisionProblems", authenticateToken, revisionProblemsController)

export default router;