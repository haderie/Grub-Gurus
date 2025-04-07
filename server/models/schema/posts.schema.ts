import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Post collection.
 *
 * This schema defines the structure for storing posts in the database. Each post includes the following fields:
 *
 * - `username`: The username of the user who created the post.
 * - `recipe`: A reference to the `Recipe` document associated with the post.
 * - `text`: An optional text content for the post.
 * - `datePosted`: The date the post was created.
 * - `likes`: An array of usernames who liked the post.
 * - `saves`: An array of usernames who saved the post.
 */

const postsSchema: Schema = new Schema(
  {
    username: { type: String },
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe' },
    text: { type: String },
    datePosted: { type: Date, default: Date.now },
    likes: { type: [String], default: [] },
    saves: { type: [String], default: [] },
  },
  { collection: 'Posts', timestamps: true },
);

export default postsSchema;
