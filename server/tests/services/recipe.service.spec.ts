import { DatabaseRecipe } from '@fake-stack-overflow/shared';
import RecipeModel from '../../models/recipe.models';
import { createCalendarRecipe, createRecipe } from '../../services/recipe.service';
import { user } from '../mockData.models';

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
        views: [],
        privacyPublic: true,
        ingredients: ['pasta, pesto, parmesean, olive oil'],
        description: 'a delicious dish',
        instructions: 'cook pasta, add pesto, stir, add cheese, enjoy',
        cookTime: 20,
        numOfLikes: 0,
        addedToCalendar: false,
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
      expect(result.numOfLikes).toEqual(recipe.numOfLikes);
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
        views: [],
        privacyPublic: true,
        ingredients: ['pasta, pesto, parmesean, olive oil'],
        description: 'a delicious dish',
        instructions: 'cook pasta, add pesto, stir, add cheese, enjoy',
        cookTime: 20,
        numOfLikes: 0,
        addedToCalendar: false,
      };
      const saveError = await createRecipe(recipe);

      expect('error' in saveError).toBe(true);
    });
  });

  describe('createCalendarRecipe', () => {
    test('should create a recipe for the calendar successfully', async () => {
      const recipeCalendar = {
        user,
        tags: [],
        title: 'Pesto Pasta',
        views: [],
        privacyPublic: true,
        ingredients: ['pasta, pesto, parmesean, olive oil'],
        description: 'a delicious dish',
        instructions: 'cook pasta, add pesto, stir, add cheese, enjoy',
        cookTime: 20,
        numOfLikes: 0,
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
      expect(result.numOfLikes).toEqual(recipeCalendar.numOfLikes);
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
        views: [],
        privacyPublic: true,
        ingredients: ['pasta, pesto, parmesean, olive oil'],
        description: 'a delicious dish',
        instructions: 'cook pasta, add pesto, stir, add cheese, enjoy',
        cookTime: 20,
        numOfLikes: 0,
        addedToCalendar: false,
        start: new Date(),
        end: new Date(),
        color: '#fffff',
      };
      const saveError = await createCalendarRecipe(recipeCalendar);

      expect('error' in saveError).toBe(true);
    });
  });
});
