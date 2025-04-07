import { Schema } from 'mongoose';

/**
 * Mongoose schema for Guess The Ingriedient (GTI) game state.
 *
 * This schema defines the structure of the game state specific to the GTI game. It includes the following fields:
 * - `player`: The username of the player in the game
 *   `attempts`: The number of guessing attempt made by the user.
 * - `correctIngredient`: The correct ingredient to be guessed.
 * - `hints`: The hints provided to the user.
 * - `imageURL`: The URL of the image to be used as the ingredient.
 * - `status`: The current game status, which can be one of the following values:
 *    - `'IN_PROGRESS'`: The game is ongoing.
 *    - `'WAITING_TO_START'`: The game is waiting to start.
 *    - `'OVER'`: The game is finished.
 * - `revealed`: Boolean determining if the image has been revealed or not.
 * - `score`: The calculated score of the user based on number of attempts.
 *    - `player1`: The score for the first player.
 *    - `player2`: The score for the second player.
 * - `currentPlayer`: The username of the player whose turn it is to make a guess.
 */

const guessTheIngredientStateSchema = new Schema({
  player1: {
    type: String,
  },
  player2: {
    type: String,
  },
  attempts: {
    player1: {
      type: Number,
      default: 0,
    },
    player2: {
      type: Number,
      default: 0,
    },
  },
  correctIngredient: {
    type: String,
    required: true,
  },
  hints: {
    type: [String],
    default: [],
  },
  imageURL: {
    type: String,
    required: true,
  },
  revealed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    status: { type: String, enum: ['IN_PROGRESS', 'WAITING_TO_START', 'OVER'], required: true },
  },
  score: {
    player1: {
      type: Number,
      default: 0,
    },
    player2: {
      type: Number,
      default: 0,
    },
  },
  currentPlayer: {
    type: String,
  },
});

const guessTheIngredientSchema = new Schema({
  state: { type: guessTheIngredientStateSchema, required: true },
});

export default guessTheIngredientSchema;
