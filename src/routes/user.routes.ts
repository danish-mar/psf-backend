import { register, login } from '../controller/auth.controller';
import express from 'express';

const router = express.Router();
// @ts-ignore
router.post('/register', register);
// @ts-ignore
router.post('/login', login);

export default router;
