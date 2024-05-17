import express from 'express';
import { registerController, loginController, testController } from '../controllers/authController.js';


//router object
const router = express.Router();

//routing 
//REGISTER
router.post("/register", registerController);

//LOGIN
router.post("/login", loginController);

export default router;