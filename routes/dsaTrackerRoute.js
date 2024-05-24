import express from 'express';
import { getQuestionsByTopicsController, getAllProblemsController } from '../controllers/problemController.js';


//router object
const router = express.Router();

//routing 

router.post("/home", getQuestionsByTopicsController);

router.get("/home", getAllProblemsController);
export default router;