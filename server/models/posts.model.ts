import mongoose, { Model } from 'mongoose';
import postSchema from './schema/posts.schema';
import { DatabasePost } from '../types/types';

/**
 * Mongoose model for the `Recipe` collection.
 *
 * This model is created using the `DatabaseRecipe` interface and the `recipeSchema`, representing the
 * `Recipe` collection in the MongoDB database, and provides an interface for interacting with
 * stored recipes.
 *
 * @type {Model<DatabaseRecipe>}
 */
const PostModel: Model<DatabasePost> = mongoose.model<DatabasePost>('Posts', postSchema);

export default PostModel;
