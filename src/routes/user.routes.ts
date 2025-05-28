import { register, login } from '../controller/auth.controller';
import { getProfile, updateProfile } from "../controller/user.controller"
import { authenticateToken, requireApplicantOrAdmin } from "../middleware/authentication.middleware";
import express from 'express';

const router = express.Router();
// @ts-ignore
router.post('/register', register);
// @ts-ignore
router.post('/login', login);

// @ts-ignore
router.get("/me", authenticateToken, requireApplicantOrAdmin, getProfile);

// @ts-ignore
router.put("/me", authenticateToken, requireApplicantOrAdmin, updateProfile);

// @ts-ignore
export default router;
