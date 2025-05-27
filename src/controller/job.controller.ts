import { Request, Response } from "express";
import { Job, IJob } from "../models/job.model";

interface AuthRequest extends Request {
  user?:{
    userId: string;
    role: string;
  };
}

// Create a new job
export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const jobData: Partial<IJob> = req.body;
    const job = new Job(jobData);
    await job.save();
    res.status(201).json(job);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get all active jobs
export const getJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await Job.find({ isActive: true });
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single job by ID
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a job by ID
export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Delete (deactivate) a job by ID
export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deactivated", job });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
