import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // hashed password
  role: "admin" | "applicant";
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "applicant"], default: "applicant" },
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>("User", userSchema);
