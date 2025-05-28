import { Schema, model, Document, Types } from "mongoose";

export interface IApplication extends Document {
  job: Types.ObjectId;
  applicant: Types.ObjectId;
  coverLetter?: string;
  appliedAt: Date;
  status: "pending" | "reviewed" | "rejected" | "accepted";
}

const applicationSchema = new Schema<IApplication>({
  job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  applicant: { type: Schema.Types.ObjectId, ref: "User", required: true },
  coverLetter: { type: String },
  appliedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "reviewed", "rejected", "accepted"],
    default: "pending",
  },
});

export const Application = model<IApplication>("Application", applicationSchema);
