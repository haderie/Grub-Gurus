import { Schema } from 'mongoose';

/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each User includes the following fields:
 * - `username`: The username of the user.
 * - `password`: The encrypted password securing the user's account.
 * - `dateJoined`: The date the user joined the platform.
 * - 'biography': The biography of the user.
 * - 'certified': true if the user is a certified user, otherwise false.
 * - 'followers': represents the array of Users that follow this user.
 * - 'following': represents the array of Users this user follows.
 * - `recipeBookPublic`: determines if the user's recipe book is public.
 * - `privacySetting`: represents the privacy setting for the user's account. Can be either 'Public' or 'Private'.
 * - `postsCreated`: an array of ObjectId references to posts created by this user.
 */

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      immutable: true,
    },
    password: {
      type: String,
    },
    dateJoined: {
      type: Date,
    },
    biography: {
      type: String,
      default: '',
    },
    certified: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    recipeBookPublic: {
      type: Boolean,
      default: false,
    },
    privacySetting: {
      type: String,
      enum: ['Public', 'Private'],
      default: 'Public',
    },
    postsCreated: {
      type: [Schema.Types.ObjectId],
      ref: 'Post',
      default: [],
    },
    rankings: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { collection: 'User' },
);

export default userSchema;
