import { Request, Response } from "express";
import { getProfile, updateProfile } from "../controller/user.controller";
import { User } from "../models/user.model";

jest.mock("../models/user.model");

describe("User Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock })) as any;

        res = {
            status: statusMock,
            json: jsonMock,
        };

        jest.clearAllMocks();
    });

    describe("getProfile", () => {
        it("should return user profile without password", async () => {
            const userId = "user123";
            const userData = {
                _id: userId,
                name: "Denizuh",
                email: "deniz@example.com",
                role: "applicant",
                phone_no: "1234567890",
                skills: ["js", "ts"],
                toObject: function() { return this; }, // mock toObject
            };

            req = {
                // @ts-ignore
                user: { userId, role: "applicant" },
            };

            // Mock User.findById().select() chain
            (User.findById as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(userData),
            });

            await getProfile(req as any, res as any);

            expect(User.findById).toHaveBeenCalledWith(userId);
            expect(jsonMock).toHaveBeenCalledWith(userData);
        });

        it("should return 401 if no user in request", async () => {
            req = {};
            await getProfile(req as any, res as any);

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Unauthorized" });
        });

        it("should return 404 if user not found", async () => {
            req = {
                // @ts-ignore
                user: { userId: "user123", role: "applicant" },
            };

            (User.findById as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            });

            await getProfile(req as any, res as any);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
        });

        it("should return 500 on error", async () => {
            req = {
                // @ts-ignore
                user: { userId: "user123", role: "applicant" },
            };

            (User.findById as jest.Mock).mockImplementation(() => {
                throw new Error("DB error");
            });

            await getProfile(req as any, res as any);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: "DB error" });
        });
    });

    describe("updateProfile", () => {
        it("should update allowed fields and return updated user", async () => {
            const userId = "user123";
            const existingUser = {
                _id: userId,
                name: "Old Name",
                skills: ["oldSkill"],
                phone_no: "111111",
                save: jest.fn().mockResolvedValue(true),
                toObject: function () {
                    return { ...this };
                },
            };

            req = {
                // @ts-ignore
                user: { userId, role: "applicant" },
                body: {
                    name: "New Name",
                    skills: ["js", "ts"],
                    phone_no: "222222",
                },
            };

            (User.findById as jest.Mock).mockResolvedValue(existingUser);

            await updateProfile(req as any, res as any);

            expect(User.findById).toHaveBeenCalledWith(userId);
            expect(existingUser.save).toHaveBeenCalled();

            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "New Name",
                    skills: ["js", "ts"],
                    phone_no: "222222",
                })
            );
        });

        it("should return 400 if invalid updates are attempted", async () => {
            req = {
                // @ts-ignore
                user: { userId: "user123", role: "applicant" },
                body: {
                    role: "admin", // invalid update
                },
            };

            await updateProfile(req as any, res as any);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid updates" });
        });

        it("should return 401 if user is not authenticated", async () => {
            req = { body: { name: "Test" } };

            await updateProfile(req as any, res as any);

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Unauthorized" });
        });

        it("should return 404 if user not found", async () => {
            req = {
                // @ts-ignore
                user: { userId: "user123", role: "applicant" },
                body: { name: "New Name" },
            };

            (User.findById as jest.Mock).mockResolvedValue(null);

            await updateProfile(req as any, res as any);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
        });

        it("should return 500 on error", async () => {
            req = {
                // @ts-ignore
                user: { userId: "user123", role: "applicant" },
                body: { name: "New Name" },
            };

            (User.findById as jest.Mock).mockImplementation(() => {
                throw new Error("DB error");
            });

            await updateProfile(req as any, res as any);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: "DB error" });
        });
    });
});
