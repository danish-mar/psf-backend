// __tests__/job.controller.test.ts
import { Request, Response } from "express";
import { createJob, getJobs, getJobById } from "../controller/job.controller";
import { Job } from "../models/job.model";

jest.mock("../models/job.model");

describe("Job Controller", () => {
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
    });

    describe("createJob", () => {
        it("should create a new job", async () => {
            const jobData = { title: "Frontend Dev", description: "Build UI", isActive: true };

            req = {
                body: jobData,
            };

            const savedJob = { ...jobData }; // simulate what you'd return from DB
            const saveMock = jest.fn().mockResolvedValue(savedJob);
            (Job as any).mockImplementation(() => ({ ...savedJob, save: saveMock }));

            await createJob(req as any, res as any);

            expect(saveMock).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining(jobData));
        });
    });


    describe("getJobs", () => {
        it("should return all active jobs", async () => {
            const jobs = [{ title: "Backend Dev", isActive: true }];
            (Job.find as jest.Mock).mockResolvedValue(jobs);

            await getJobs({} as any, res as any);

            expect(jsonMock).toHaveBeenCalledWith(jobs);
        });
    });

    describe("getJobById", () => {
        it("should return job by ID", async () => {
            const job = { title: "Mobile Dev" };
            (Job.findById as jest.Mock).mockResolvedValue(job);

            req = {
                params: { id: "abc123" },
            };

            await getJobById(req as any, res as any);

            expect(jsonMock).toHaveBeenCalledWith(job);
        });

        it("should return 404 if job not found", async () => {
            (Job.findById as jest.Mock).mockResolvedValue(null);

            req = {
                params: { id: "missing-id" },
            };

            await getJobById(req as any, res as any);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Job not found" });
        });
    });
});
