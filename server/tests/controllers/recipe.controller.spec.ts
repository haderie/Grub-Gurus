import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../../app';
import * as util from '../../services/recipe.service';
import * as databaseUtil from '../../utils/database.util';

import {
  DatabaseRecipe,
  Recipe,
  User,
  RecipeCalendarEvent,
  PopulatedDatabaseRecipe,
  SafePopulatedDatabaseUser,
} from '../../types/types';

const mockUser: User = {
  username: 'user1',
  password: 'password',
  dateJoined: new Date('2024-12-03'),
  certified: false,
  followers: [],
  following: [],
  privacySetting: 'Public',
  recipeBookPublic: false,
  postsCreated: [],
  highScore: 0,
  rankings: [],
};

const mockUserId = new mongoose.Types.ObjectId();

const mockSafePopulatedUser: SafePopulatedDatabaseUser = {
  _id: new mongoose.Types.ObjectId(),
  username: 'user1',
  dateJoined: new Date('2024-12-03'),
  certified: false,
  followers: [],
  following: [],
  privacySetting: 'Public',
  recipeBookPublic: false,
  postsCreated: [],
  highScore: 0,
  rankings: [],
};

const recipePost: PopulatedDatabaseRecipe = {
  _id: new mongoose.Types.ObjectId(),
  user: mockSafePopulatedUser,
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

const calendarRecipeDataBase: DatabaseRecipe = {
  _id: new mongoose.Types.ObjectId(),
  user: mockUserId,
  tags: [],
  title: 'BBQ Chicken',
  privacyPublic: true,
  ingredients: ['chicken, BBQ sauce, onion'],
  description: 'a quick and yummy dinner',
  instructions: 'bake chicken at 350, add BBQ sauce, enjoy',
  cookTime: 40,
  addedToCalendar: true,
  video: '',
};

const recipe: Recipe = {
  user: mockUser,
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

const calendarRecipe: RecipeCalendarEvent = {
  user: mockUser,
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

const createRecipeSpy = jest.spyOn(util, 'createRecipe');
const createCalendarRecipeSpy = jest.spyOn(util, 'createCalendarRecipe');
const updateRecipeSpy = jest.spyOn(util, 'updateRecipeToCalendarRecipe');
const getRecipesByUsername = jest.spyOn(util, 'getRecipesByUsername');

describe('Test recipeController', () => {
  describe('GET /recipe/getRecipes/:username', () => {
    it('should return 200 and list of recipes for a valid username', async () => {
      // Mock a valid response for getRecipesByUsername

      getRecipesByUsername.mockResolvedValueOnce([recipePost]);

      // Make the request to fetch recipes for the user
      const response = await supertest(app).get('/recipe/getRecipes/user1');

      expect(response.status).toBe(200);
      // expect(response.body).toEqual([recipePost]); // Should match the mock response
    });

    it('should return 500 if there is an error fetching recipes', async () => {
      // Mock an error for getRecipesByUsername
      getRecipesByUsername.mockRejectedValueOnce({ error: 'Error fetching recipe' });

      // Make the request to fetch recipes for the user
      const response = await supertest(app).get('/recipe/getRecipes/user1');

      expect(response.status).toBe(500);
    });
  });

  describe('POST /addRecipe', () => {
    test('should add a recipe successfully', async () => {
      jest.spyOn(util, 'createRecipe').mockResolvedValueOnce(calendarRecipeDataBase);
      jest.spyOn(databaseUtil, 'populateDocument').mockResolvedValueOnce(recipePost);

      const response = await supertest(app).post('/recipe/addRecipe').send(recipe);
      expect(response.status).toBe(200);
      expect(response.body.title).toEqual('Pesto Pasta');
    });
    test('should return 500 if error occurs in addRecipe while saving recipe', async () => {
      jest
        .spyOn(databaseUtil, 'populateDocument')
        .mockResolvedValueOnce({ error: 'Error while populating' });

      const response = await supertest(app).post('/recipe/addRecipe').send(recipe);
      expect(response.status).toBe(500);
    });

    test('should return 400 if recipe body is invalid', async () => {
      const mockInvalidRecipe = {
        user: undefined,
        tags: [],
        title: 'Pesto Pasta',
        privacyPublic: true,
        ingredients: ['pasta, pesto, parmesean, olive oil'],
        description: 'a delicious dish',
        instructions: 'cook pasta, add pesto, stir, add cheese, enjoy',
        cookTime: 20,
        addedToCalendar: false,
      };

      const response = await supertest(app).post('/recipe/addRecipe').send(mockInvalidRecipe);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid recipe body');
    });

    test('should return 500 if recipe creation fails', async () => {
      createRecipeSpy.mockResolvedValue({ error: 'Error creating recipe' });

      const response = await supertest(app).post('/recipe/addRecipe').send(recipe);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when saving recipe: Error: Error creating recipe');
    });

    test('should return 500 if database error occurs', async () => {
      createRecipeSpy.mockRejectedValue(new Error());

      const response = await supertest(app).post('/recipe/addRecipe').send(recipe);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when saving recipe: Error');
    });
  });

  describe('POST /addCalendarRecipe', () => {
    test('should add a recipe to calendar successfully', async () => {
      createCalendarRecipeSpy.mockResolvedValue(calendarRecipeDataBase);

      const response = await supertest(app).post('/recipe/addCalendarRecipe').send(calendarRecipe);
      expect(response.status).toBe(200);
      expect(response.body.title).toEqual('BBQ Chicken');
      expect(response.body.addedToCalendar).toEqual(true);
    });

    test('should return 400 if recipe body is invalid', async () => {
      const mockInvalidCalendarRecipe = {
        user: undefined,
        tags: [],
        title: 'Pesto Pasta',
        privacyPublic: true,
        ingredients: ['pasta, pesto, parmesean, olive oil'],
        description: 'a delicious dish',
        instructions: 'cook pasta, add pesto, stir, add cheese, enjoy',
        cookTime: 20,
        addedToCalendar: true,
      };

      const response = await supertest(app)
        .post('/recipe/addCalendarRecipe')
        .send(mockInvalidCalendarRecipe);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid recipe body');
    });

    test('should return 500 if recipe creation fails', async () => {
      createCalendarRecipeSpy.mockResolvedValue({ error: 'Error creating recipe' });

      const response = await supertest(app).post('/recipe/addCalendarRecipe').send(calendarRecipe);

      expect(response.status).toBe(500);
      expect(response.text).toBe(
        'Error when adding recipe to calendar: Error: Error creating recipe',
      );
    });

    test('should return 500 if database error occurs', async () => {
      createCalendarRecipeSpy.mockRejectedValue(new Error());

      const response = await supertest(app).post('/recipe/addCalendarRecipe').send(calendarRecipe);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when adding recipe to calendar: Error');
    });
  });

  describe('PATCH /updateRecipeForCalendar', () => {
    test('should update a recipe successfully', async () => {
      updateRecipeSpy.mockResolvedValue(calendarRecipeDataBase);

      const response = await supertest(app)
        .patch('/recipe/updateRecipeForCalendar')
        .send({ recipeID: calendarRecipeDataBase._id, ...calendarRecipe });

      expect(response.status).toBe(200);
      expect(response.body.title).toEqual('BBQ Chicken');
    });

    test('should return 400 if recipe body is invalid', async () => {
      const response = await supertest(app)
        .patch('/recipe/updateRecipeForCalendar')
        .send({ recipeID: undefined, ...calendarRecipe });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid recipe body');
    });

    test('should return 500 if recipe update fails', async () => {
      updateRecipeSpy.mockResolvedValue({ error: 'Error updating recipe' });

      const response = await supertest(app)
        .patch('/recipe/updateRecipeForCalendar')
        .send({ recipeID: calendarRecipeDataBase._id, ...calendarRecipe });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when updating recipe: Error: Error updating recipe');
    });

    test('should return 500 if database error occurs', async () => {
      updateRecipeSpy.mockRejectedValue(new Error());

      const response = await supertest(app)
        .patch('/recipe/updateRecipeForCalendar')
        .send({ recipeID: calendarRecipeDataBase._id, ...calendarRecipe });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when updating recipe: Error');
    });
  });
});
