import { DatabaseRecipe, RecipeCalendarEvent } from '../../types/types';
import RecipeModel from '../../models/recipe.models';
import UserModel from '../../models/users.model';

import {
  createCalendarRecipe,
  createRecipe,
  updateRecipeToCalendarRecipe,
  getRecipesByUsername,
  getRecipeByID,
} from '../../services/recipe.service';
import { sampleRecipe, user } from '../mockData.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('Recipe model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('createRecipe', () => {
    test('should create a recipe successfully', async () => {
      const recipe = {
        user,
        tags: [],
        title: 'Pesto Pasta',
        privacyPublic: true,
        ingredients: ['pasta, pesto, parmesean, olive oil'],
        description: 'a delicious dish',
        instructions: 'cook pasta, add pesto, stir, add cheese, enjoy',
        cookTime: 20,
        addedToCalendar: false,
        video: '',
      };

      const result = (await createRecipe(recipe)) as DatabaseRecipe;
      expect(result._id).toBeDefined();
      expect(result.tags).toEqual(recipe.tags);
      expect(result.title).toEqual(recipe.title);
      expect(result.privacyPublic).toEqual(true);
      expect(result.ingredients).toEqual(recipe.ingredients);
      expect(result.description).toEqual(recipe.description);
      expect(result.instructions).toEqual(recipe.instructions);
      expect(result.cookTime).toEqual(recipe.cookTime);
      expect(result.addedToCalendar).toEqual(false);
    });

    test('should throw an error if error when creating recipe', async () => {
      jest
        .spyOn(RecipeModel, 'create')
        .mockRejectedValueOnce(() => new Error('Error saving document'));
      const recipe = {
        user,
        tags: [],
        title: 'Pesto Pasta',
        privacyPublic: true,
        ingredients: ['pasta, pesto, parmesean, olive oil'],
        description: 'a delicious dish',
        instructions: 'cook pasta, add pesto, stir, add cheese, enjoy',
        cookTime: 20,
        addedToCalendar: false,
        video: '',
      };

      const saveError = await createRecipe(recipe);

      expect('error' in saveError).toBe(true);
    });
  });

  describe('getRecipesByUsername', () => {
    test('should return recipes for a valid user', async () => {
      mockingoose(UserModel).toReturn(user, 'findOne');
      mockingoose(RecipeModel).toReturn([sampleRecipe], 'find');

      const result = await getRecipesByUsername(user.username);
      expect(result).toEqual([{ ...sampleRecipe, color: '#ff0000', start: null, end: null }]);
    });

    test('should return error if user not found', async () => {
      mockingoose(UserModel).toReturn(null, 'findOne');

      const result = await getRecipesByUsername('nonexistent');
      expect('error' in result).toBe(true);
    });

    test('should return error if DB error occurs', async () => {
      mockingoose(UserModel).toReturn(new Error('DB Error'), 'findOne');

      const result = await getRecipesByUsername(user.username);
      expect('error' in result).toBe(true);
    });
  });

  describe('getRecipeByID', () => {
    test('should return a recipe if found', async () => {
      mockingoose(RecipeModel).toReturn(sampleRecipe, 'findOne');

      const result = await getRecipeByID(sampleRecipe._id.toString());
      expect(result).toEqual({ ...sampleRecipe, color: '#ff0000', start: null, end: null });
    });

    test('should return error if recipe not found', async () => {
      mockingoose(RecipeModel).toReturn(null, 'findOne');

      const result = await getRecipeByID('nonexistentID');
      expect('error' in result).toBe(true);
    });

    test('should return error if DB error occurs', async () => {
      mockingoose(RecipeModel).toReturn(new Error('DB Error'), 'findOne');

      const result = await getRecipeByID(sampleRecipe._id.toString());
      expect('error' in result).toBe(true);
    });
  });

  describe('createCalendarRecipe', () => {
    test('should create a recipe for the calendar successfully', async () => {
      const recipeCalendar = {
        user,
        tags: [],
        title: 'Pesto Pasta',
        privacyPublic: true,
        ingredients: ['pasta, pesto, parmesean, olive oil'],
        description: 'a delicious dish',
        instructions: 'cook pasta, add pesto, stir, add cheese, enjoy',
        cookTime: 20,
        addedToCalendar: true,
        start: new Date(),
        end: new Date(),
        color: '#fffff',
      };

      const result = (await createCalendarRecipe(recipeCalendar)) as DatabaseRecipe;
      expect(result._id).toBeDefined();
      expect(result.tags).toEqual(recipeCalendar.tags);
      expect(result.title).toEqual(recipeCalendar.title);
      expect(result.privacyPublic).toEqual(true);
      expect(result.ingredients).toEqual(recipeCalendar.ingredients);
      expect(result.description).toEqual(recipeCalendar.description);
      expect(result.instructions).toEqual(recipeCalendar.instructions);
      expect(result.cookTime).toEqual(recipeCalendar.cookTime);
      expect(result.addedToCalendar).toEqual(true);
    });

    test('should throw an error if error when creating a recipe for the calendar', async () => {
      jest
        .spyOn(RecipeModel, 'create')
        .mockRejectedValueOnce(() => new Error('Error saving document'));
      const recipeCalendar = {
        user,
        tags: [],
        title: 'Pesto Pasta',
        privacyPublic: true,
        ingredients: ['pasta, pesto, parmesean, olive oil'],
        description: 'a delicious dish',
        instructions: 'cook pasta, add pesto, stir, add cheese, enjoy',
        cookTime: 20,
        addedToCalendar: false,
        start: new Date(),
        end: new Date(),
        color: '#fffff',
      };
      const saveError = await createCalendarRecipe(recipeCalendar);

      expect('error' in saveError).toBe(true);
    });
  });

  describe('updateRecipeToCalendarRecipe', () => {
    const updatedRecipe = {
      ...sampleRecipe,
      addedToCalendar: true,
      start: new Date(),
      end: new Date(),
      color: '#fffff',
    };

    const updates: Partial<RecipeCalendarEvent> = {
      addedToCalendar: true,
      start: new Date(),
      end: new Date(),
      color: '#fffff',
    };

    beforeEach(() => {
      mockingoose.resetAll();
    });

    test('should update a recipe successfully', async () => {
      mockingoose(RecipeModel).toReturn(updatedRecipe, 'findOneAndUpdate');

      expect(sampleRecipe.addedToCalendar).toEqual(false);

      const result = (await updateRecipeToCalendarRecipe(
        sampleRecipe._id,
        updates,
      )) as DatabaseRecipe;

      expect(result._id).toBeDefined();
      expect(result.tags).toEqual(sampleRecipe.tags);
      expect(result.title).toEqual(sampleRecipe.title);
      expect(result.privacyPublic).toEqual(true);
      expect(result.ingredients).toEqual(sampleRecipe.ingredients);
      expect(result.description).toEqual(sampleRecipe.description);
      expect(result.instructions).toEqual(sampleRecipe.instructions);
      expect(result.cookTime).toEqual(sampleRecipe.cookTime);
      expect(result.addedToCalendar).toEqual(true);
    });

    test('should return an error if recipe is not found', async () => {
      mockingoose(RecipeModel).toReturn(null, 'findOneAndUpdate');

      const updateError = await updateRecipeToCalendarRecipe(sampleRecipe._id, updates);

      expect('error' in updateError).toBe(true);
    });

    test('should return an error if database error occurs', async () => {
      mockingoose(RecipeModel).toReturn(new Error(), 'findOneAndUpdate');

      const updateError = await updateRecipeToCalendarRecipe(sampleRecipe._id, updates);

      expect('error' in updateError).toBe(true);
    });
  });
});
