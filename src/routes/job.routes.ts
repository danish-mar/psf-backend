import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controller/job.controller";

import {authenticateToken, requireAdmin} from "../middleware/authentication.middleware";

const router = express.Router();

// public routes

router.get("/", getJobs);
// @ts-ignore
router.get("/:id", getJobById);

// Protected routes
// @ts-ignore
router.post("/", authenticateToken, requireAdmin, createJob);
// @ts-ignore
router.put("/:id", authenticateToken, requireAdmin, updateJob);
// @ts-ignore
router.delete("/:id", authenticateToken, requireAdmin, deleteJob);


export default router;