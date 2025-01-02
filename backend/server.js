import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import participantsRoutes from './routes/participants.js';

dotenv.config(); // Loading environment variables
const app = express(); // Initializes express app used to define routes and middleware

// Configure CORS with specific origins and settings
const corsOptions = {
  origin: process.env.CLIENT_URL || '*', // Allow requests from your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions)); // Apply CORS middleware
app.use(express.json());
app.use('/participants', participantsRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 5000; // Decide PORT for running the app

console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // Connects to MongoDB using URI
  .then(() => console.log("Connected to MongoDB")) // Logs message if connection is successful
  .catch((error) => console.log("MongoDB connection error:", error)); // Logs error if connection fails

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)); // Listens for incoming requests
