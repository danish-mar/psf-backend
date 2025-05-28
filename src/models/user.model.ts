import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // hashed password
  role: "admin" | "applicant";
  createdAt: Date;
  skills: string[];
  phone_no: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "applicant"], default: "applicant" },
  createdAt: { type: Date, default: Date.now },
  skills: { type: [String], default: [] },
  phone_no: { type: String, required: true}
});

export const User = model<IUser>("User", userSchema);
