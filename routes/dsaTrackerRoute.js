import express from 'express';
import { problemFetchingController } from '../controllers/problemController.js';


//router object
const router = express.Router();

//routing 

router.get("/home", problemFetchingController);


export default router;