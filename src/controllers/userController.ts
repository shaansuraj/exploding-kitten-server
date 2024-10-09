import { Request, Response } from 'express';
import { redisClient } from '../redisClient';
import { userSchema } from '../schema/userschema';
import jwt from "jsonwebtoken";

// Initialize the user repository with the schema and create the index
const userRepository = redisClient.fetchRepository(userSchema);
(async () => {
    await userRepository.createIndex();
})();

// Function to create a JWT token for a user
const createToken = (id: string) => {
    const secret = process.env.SECRET; // Get the secret from the environment variables

    if (!secret) {
        throw new Error("JWT secret is missing in environment variables."); // Throw an error if secret is not defined
    }

    const token = jwt.sign({ id: id }, secret, { expiresIn: '3d' }); // Use the secret from the environment
    return token;
}

// Extend the Request interface to include the current user ID
interface CustomRequest extends Request {
    currUserId?: any;
}

/**
 * Create a new user and generate a JWT token.
 */
const createUser = async (req: CustomRequest, res: Response) => {
    try {
        const { email, password } = req.body;

        // Create a new user entity
        const user = userRepository.createEntity({
            password: password,
            email: email,
            score: 0,
        });

        // Save the user and retrieve the ID
        const id = await userRepository.save(user);
        console.log(id);

        // Create a token for the newly created user
        const token = createToken(id);

        // Respond with the user's email and the token
        res.status(200).json({
            email: email,
            token: token
        });
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
}

/**
 * Sign in an existing user and generate a JWT token.
 */
const signInUser = async (req: CustomRequest, res: Response) => {
    try {
        const { email, password } = req.body;

        // Search for the user by email and password
        const userSearch: any = await userRepository.search()
            .where('email').eq(email)
            .where('password').eq(password)
            .return.first();

        // Handle invalid credentials
        if (!userSearch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create a token for the authenticated user
        const token = createToken(userSearch?.entityId);

        // Respond with the user's email and the token
        res.status(200).json({
            email: userSearch.email,
            token: token
        });
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
}

/**
 * Update the score of the currently authenticated user.
 */
const updateScores = async (req: CustomRequest, res: Response) => {
    try {
        // Fetch the current user using their ID from the request
        const user = await userRepository.fetch(req.currUserId);
        console.log("Current user:", user);

        // Increment the user's score
        user.score += 1;
        await userRepository.save(user);

        // Respond with the updated user data
        res.send(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Get all users (for testing purposes).
 */
const getAllUsers = async (req: CustomRequest, res: Response) => {
    try {
        const users = await userRepository.search().returnAll();
        res.send(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Get the top high scores.
 */
const getHighScores = async (req: CustomRequest, res: Response) => {
    try {
        const users = await userRepository.search()
            .sortDescending('score')
            .return.page(0, 10); // Fetch the top 10 users by score

        res.send(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

// Export the functions for use in other parts of the application
export { createUser, updateScores, signInUser, getHighScores, getAllUsers, userRepository };
