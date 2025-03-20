import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Post collection.
 *
 * This schema defines the structure for storing posts in the database.
 * Each tag includes the following fields:
 * - `recipes`: The recipes posted.
 */
const postsSchema: Schema = new Schema(
  {
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe' },
  },
  { collection: 'Posts' },
);

export default postsSchema;
