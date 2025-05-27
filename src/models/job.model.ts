import { Schema, model, Document } from "mongoose";

export interface IJob extends Document {
 // title of the job 
  title: string;
    // description of the job
  description: string;
    // location where the job is based
  location: string;
    // optional salary range for the job
  salaryRange?: { min: number; max: number };
    // optional skills required for the job
  requiredSkill?: string[];
    // date when the job was posted
  postedAt: Date;
    // boolean indicating if the job is currently active
  isActive: boolean;
}

// Schema for the salary range subdocument
const salaryRangeSchema = new Schema(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  { _id: false } // No separate _id for this subdocument
);

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  requiredSkill: { type: [String], required: true },
  location: { type: String, required: true },
  salaryRange: { type: salaryRangeSchema, required: false },
  postedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

export const Job = model<IJob>("Job", jobSchema);

export default Job;