import { Model } from 'mongoose';
import { GameInstance, GuessTheIngredientState } from '../types/types';
import GameModel from './games.model';
import guessTheIngredientSchema from './schema/guess.schema';

/**
 * Mongoose model for the `Nim` game, extending the `Game` model using a discriminator.
 *
 * This model adds specific fields from the `nimSchema` to the `Game` collection, enabling operations
 * specific to the `Nim` game type while sharing the same collection.
 */
const GuessModel: Model<GameInstance<GuessTheIngredientState>> = GameModel.discriminator(
  'Guess',
  guessTheIngredientSchema,
);

export default GuessModel;
