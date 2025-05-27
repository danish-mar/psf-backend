import { login, register } from '../controller/auth.controller';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

jest.mock('../models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Auth Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should login with valid credentials', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'password123' }
            } as Request;

            const user = {
                _id: 'userId123',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'admin'
            };

            (User.findOne as jest.Mock).mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

            const res = mockResponse();

            await login(req, res);

            expect(res.json).toHaveBeenCalledWith({
                token: 'mockedToken',
                role: 'admin'
            });
        });

        it('should return 401 if user not found', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'password123' }
            } as Request;

            (User.findOne as jest.Mock).mockResolvedValue(null);

            const res = mockResponse();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });

        it('should return 401 if password is incorrect', async () => {
            const req = {
                body: { email: 'test@example.com', password: 'wrongpass' }
            } as Request;

            const user = {
                email: 'test@example.com',
                password: 'hashedPassword'
            };

            (User.findOne as jest.Mock).mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const res = mockResponse();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const req = {
                body: {
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                }
            } as Request;

            const savedUser = {
                _id: 'userId123',
                email: 'test@example.com',
                role: 'applicant'
            };

            (User.findOne as jest.Mock).mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (User as any).mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(savedUser),
                _id: 'userId123',
                role: 'applicant'
            }));
            (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

            const res = mockResponse();

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                token: 'mockedToken',
                role: 'applicant'
            });
        });

        it('should return 400 if email already exists', async () => {
            const req = {
                body: {
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                }
            } as Request;

            (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

            const res = mockResponse();

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists' });
        });
    });
});
