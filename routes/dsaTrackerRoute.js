import express from 'express';
import { getAllProblemsController } from '../controllers/problemController.js';
import authenticateToken from '../middlewares/authenticateToken.js';
//router object
const router = express.Router();

//routing 

router.get("/home", authenticateToken, getAllProblemsController);

router.get('/', (req, res) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to DSA TRACKER</title>
            <style>
                body {
                    display: flex;
                    flex-direction:column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                }
                h1 {
                    color: #333;
                }
                h2{
                    color: #333;
                    margin-top:-1vh;
                }
            </style>
        </head>
        <body>
            <h1>Welcome to DSA TRACKER</h1>
            <h2>Designed by Skill 2040 Developers</h2>
        </body>
        </html>
    `;
    res.send(htmlContent);
});
export default router;