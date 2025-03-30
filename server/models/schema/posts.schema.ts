import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Post collection.
 *
 * This schema defines the structure for storing posts in the database.
 * Each post includes the following fields:
 * - `recipes`: The recipes posted.
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
