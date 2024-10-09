import { Entity, Schema } from "redis-om";

/**
 * Interface for the User entity representing a user in the application.
 */
interface User {
    password: string; // User's password
    email: string;    // User's email address
    score: number;    // User's score in the game
}

/**
 * Class representing a User entity in Redis OM.
 * This extends the Entity class provided by Redis OM.
 */
class User extends Entity { }

/**
 * Schema definition for the User entity.
 * 
 * Fields:
 * - password: a string field representing the user's password.
 * - email: a string field representing the user's email address.
 * - score: a numeric field representing the user's score, which is sortable.
 * 
 * The schema uses the JSON data structure to store the entity in Redis.
 */
export const userSchema = new Schema(User, {
    password: { type: 'string' },    // Password field (string)
    email: { type: 'string' },       // Email field (string)
    score: { 
        type: 'number',              // Score field (number)
        sortable: true               // Allow sorting by score in queries
    }
}, {
    dataStructure: "JSON"             // Use JSON data structure in Redis for flexibility
});
