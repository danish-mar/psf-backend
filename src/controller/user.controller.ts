import { Request, Response } from "express";
import { User, IUser } from "../models/user.model";

interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

// Get own profile
export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update own profile (except role, email, password here)
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        // Only allow updating certain fields
        const allowedUpdates = ["name", "skills", "phone_no"];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((update) =>
            allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
            return res.status(400).json({ message: "Invalid updates" });
        }

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        updates.forEach((update) => {
            (user as any)[update] = req.body[update];
        });

        await user.save();

        const userObj = user.toObject();
        // @ts-ignore
        delete userObj.password; // remove password from response

        res.json(userObj);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
