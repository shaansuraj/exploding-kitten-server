import express from 'express';
import { createUser, updateScores, getHighScores, signInUser, getAllUsers } from '../controllers/userController';
import { checkAuth } from '../middleware/checkAuth';

// Create a new router instance for authentication-related routes
const authRouter = express.Router();

// Route for user signup
authRouter.post('/signup', createUser);

// Route for user login
authRouter.post('/login', signInUser);

// Apply the checkAuth middleware to all subsequent routes in this router
authRouter.use(checkAuth);

// Route for updating user scores (authentication required)
authRouter.get('/updatescore', updateScores);

// Route for fetching high scores (authentication required)
authRouter.get('/highest', getHighScores);

// Uncomment the following line to enable fetching all users for testing purposes
authRouter.get('/', getAllUsers);

// Export the authRouter for use in the main application
export { authRouter };
