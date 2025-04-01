import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../../app';
import * as util from '../../services/post.service';
import { DatabasePost, DatabaseRecipe, User } from '../../types/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

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
};

const mockRecipe: DatabaseRecipe = {
  _id: new mongoose.Types.ObjectId(),
  user: mockUser,
  tags: [],
  title: 'Pesto Pasta',
  privacyPublic: true,
  ingredients: ['pasta, pesto, parmesean, olive oil'],
  description: 'a delicious dish',
  instructions: 'cook pasta, add pesto, stir, add cheese, enjoy',
  cookTime: 20,
  addedToCalendar: false,
  numOfLikes: 0,
  views: [],
};

const mockSampleLikedPost: DatabasePost = {
  _id: new mongoose.Types.ObjectId(),
  recipe: mockRecipe._id,
  username: mockUser.username,
  datePosted: new Date(),
  likes: ['user1'],
  saves: [],
};

const likePostSpy = jest.spyOn(util, 'likePost');

describe('PATCH /updatePostLikes', () => {
  test('should update post likes successfully', async () => {
    const mockReqBody = {
      postID: mockSampleLikedPost._id,
      username: mockUser.username,
    };
    likePostSpy.mockResolvedValue(mockSampleLikedPost);

    const response = await supertest(app).patch('/posts/updatePostLikes').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body.likes).toContain(mockUser.username);
  });

  test('should return 400 if postID or username is missing', async () => {
    const response = await supertest(app).patch('/posts/updatePostLikes').send({});

    expect(response.status).toBe(500);
    expect(response.text).toBe(
      'Error when updating post likes: Error: PostID and Username required',
    );
  });

  test('should return 500 if post is not found', async () => {
    const mockReqBody = {
      postID: undefined,
      username: mockUser.username,
    };
    likePostSpy.mockResolvedValue(mockSampleLikedPost);

    const response = await supertest(app).patch('/posts/updatePostLikes').send(mockReqBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe(
      'Error when updating post likes: Error: PostID and Username required',
    );
  });

  test('should return 500 if updating likes fails', async () => {
    const mockReqBody2 = {
      postID: mockSampleLikedPost._id,
      username: mockUser.username,
    };
    likePostSpy.mockRejectedValue(new Error());

    const response = await supertest(app).patch('/posts/updatePostLikes').send(mockReqBody2);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when updating post likes: Error');
  });
});
