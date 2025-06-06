import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Answer collection.
 *
 * This schema defines the structure for storing answers in the database.
 * Each answer includes the following fields:
 * - `text`: The content of the answer.
 * - `ansBy`: The username of the user who provided the answer.
 * - `ansDateTime`: The date and time when the answer was given.
 * - `comments`: Comments that have been added to the answer by users.
 * - `youtubeVideoUrl`: An optional URL to a YouTube video.
 * - `isUserCertified`: A Boolean indicating whether the user who provided the answer is certified or not.
 */
const answerSchema: Schema = new Schema(
  {
    text: {
      type: String,
    },
    ansBy: {
      type: String,
    },
    ansDateTime: {
      type: Date,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    youtubeVideoUrl: { type: String },
  },
  { collection: 'Answer' },
);

export default answerSchema;
