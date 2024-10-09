import { Client } from 'redis-om';
import { config } from 'dotenv';

// Load environment variables from the .env file
config();

// Initialize the Redis client
const redisClient = new Client();

/**
 * Connect to the Redis instance using credentials from environment variables.
 * The URL follows the format: redis://USER:PASS@HOST:PORT
 */
(async () => {
    try {
        // Open a connection to the Redis instance
        await redisClient.open(`redis://${process.env.USER}:${process.env.PASS}@${process.env.URL}`);
        console.log("Connected to Redis successfully");
    } catch (error) {
        console.error("Error connecting to Redis:", error);
    }
})();

// Export the Redis client for use in other parts of the application
export { redisClient };
