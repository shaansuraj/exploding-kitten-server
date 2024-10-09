import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the current user ID
interface CustomRequest extends Request {
    currUserId?: string;
}

/**
 * Middleware function to check user authentication using JWT.
 * 
 * @param req - The request object containing the user's authorization token.
 * @param res - The response object used to send responses.
 * @param next - The next middleware function to call if authentication is successful.
 */
const checkAuth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    // Check if the authorization header is present and has the correct format
    if (!authorization || !authorization.startsWith("Bearer ")) {
        console.log("Invalid or missing authorization header.");
        return res.status(401).json({ error: "Authorization token not present or invalid." });
    }

    // Extract the token from the authorization header
    const token = authorization.split(' ')[1];

    try {
        // Ensure the secret is provided
        if (!process.env.SECRET) {
            throw new Error("JWT secret is missing in environment variables.");
        }

        // Verify the token and extract the user ID
        const decodedToken = jwt.verify(token, process.env.SECRET) as JwtPayload;

        // Check if the token contains a user ID (id)
        if (!decodedToken.id) {
            throw new Error("Token payload is invalid or missing 'id' field.");
        }

        // Store the user ID in the request object for future use
        req.currUserId = decodedToken.id as string;
        console.log("Current user ID is:", req.currUserId);

        // Call the next middleware function
        next();
    } catch (err) {
        // Type assertion for Error, so we can access its properties
        const errorMessage = (err as Error).message;
        console.error("Token verification failed:", errorMessage);
        res.status(401).json({ error: "Token not verified." });
    }
}

export { checkAuth };
