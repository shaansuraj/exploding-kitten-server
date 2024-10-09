import express from 'express';
import cors from 'cors';
import { authRouter } from './src/routes/userRoutes';

// Create an instance of the Express app
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define the port the server will run on (default to 5000 if not set in environment)
const port = process.env.PORT ?? 5000;

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});

// Register the authRouter for routes starting with /users
app.use('/users', authRouter);
