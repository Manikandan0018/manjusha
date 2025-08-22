import express from 'express';
import { signup, login, logout,getMe } from '../controllers/SignUp.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe); // 👈 This is what frontend will call

export default router;
