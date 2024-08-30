import express from 'express';
import authenticateToken from '../middlewares/authenticateToken.js';
import { uploadImageController } from '../controllers/userDetailsController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post("/uploadImage", upload.single('image'), authenticateToken, uploadImageController);

export default router;