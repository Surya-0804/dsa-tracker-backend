import express from 'express';
import { bookmarkProblemController, myFavController, solutionsController, notesController, problemSolvedController, problemForRevisionController } from '../controllers/problemController.js';


//router object
const router = express.Router();

// Routing
router.post("/bookmarkProblem", bookmarkProblemController);
router.get("/myFav", myFavController);
router.get("/solutions", solutionsController);
router.post("/notes", notesController);
router.post("/problemSolved", problemSolvedController);
router.post("/problemForRevision", problemForRevisionController);

export default router;