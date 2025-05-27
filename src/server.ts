import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import jobRoutes from './routes/job.routes'; // make sure this file has your route setup
import userRoutes from "./routes/user.routes";

dotenv.config();

// Initialize app
const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json()); // for parsing application/json

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', userRoutes);


// Default route
app.get('/', (_req, res) => {
    res.send('🌸 Welcome to the Job API!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
