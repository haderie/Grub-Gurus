import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import * as util from '../../services/post.service';
import * as recipeService from '../../services/recipe.service';
import * as tagService from '../../services/tag.service';
import { DatabaseTag } from '../../types/types';

// Mock data
const mockPost = {
  username: 'user1',
  recipe: new mongoose.Types.ObjectId(),
  text: 'This is a test post',
  datePosted: new Date(),
  likes: [],
  saves: [],
};

// const mockTagResponse: DatabaseTag = {
//   name: 'test-tag',
//   description: 'Test description',
//   _id: new mongoose.Types.ObjectId(),
// };

const mockPostResponse = {
  ...mockPost,
  _id: new mongoose.Types.ObjectId(),
};

// const mockRecipeResponse = {
//   _id: new mongoose.Types.ObjectId(),
//   title: 'Test Recipe',
//   ingredients: ['ing1', 'ing2'],
//   instructions: 'step1,step2',
//   user: 'testUser',
//   tags: [],
//   privacyPublic: true,
//   description: 'Test description',
//   cookTime: 30,
//   numOfLikes: 0,
//   views: [],
//   addedToCalendar: false,
// };

// Mock services
// const processTagsSpy = jest.spyOn(tagService, 'processTags');
// const createRecipeSpy = jest.spyOn(recipeService, 'createRecipe');
// const savePostSpy = jest.spyOn(util, 'savePost');
const getPostListSpy = jest.spyOn(util, 'getPostList');
const getFollowingPostListSpy = jest.spyOn(util, 'getFollowingPostList');
const likePostSpy = jest.spyOn(util, 'likePost');

describe('Post Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // describe('POST /posts/addPost', () => {
  //   it('should successfully create a post with recipe and tags', async () => {
  //     jest.setTimeout(10000);
  //     // Mock recipe creation
  //     processTagsSpy.mockResolvedValueOnce([mockTagResponse]);
  //     createRecipeSpy.mockResolvedValueOnce(mockRecipeResponse);
  //     savePostSpy.mockResolvedValueOnce(mockPostResponse);

  //     const response = await supertest(app)
  //       .post('/posts/addPost')
  //       .send({
  //         username: 'user1',
  //         recipe: {
  //           title: 'Test Recipe',
  //           ingredients: ['ing1', 'ing2'],
  //           instructions: ['step1', 'step2'],
  //           tags: ['test-tag']
  //         },
  //         text: 'Test post',
  //         datePosted: new Date(),
  //         likes: [],
  //         saves: []
  //       });

  //     jest.spyOn(PostModel, 'findById').mockResolvedValueOnce({
  //       ...mockPostResponse,
  //       recipe: mockRecipeResponse,
  //     });

  //     expect(response.status).toBe(200);
  //     expect(response.body).toHaveProperty('_id');
  //     expect(response.body.username).toBe('user1');
  //     expect(response.body.text).toBe('Test post');
  //   });

  //   it('should return 500 when recipe creation fails', async () => {
  //     jest.setTimeout(10000);
  //     createRecipeSpy.mockResolvedValueOnce({ error: 'Cannot save recipe' });

  //     const response = await supertest(app)
  //       .post('/posts/addPost')
  //       .send({
  //         username: 'user1',
  //         recipe: {
  //           title: 'Test Recipe',
  //           ingredients: ['ing1', 'ing2'],
  //           instructions: ['step1', 'step2'],
  //           tags: ['test-tag']
  //         },
  //         text: 'Test post',
  //         datePosted: new Date(),
  //         likes: [],
  //         saves: []
  //       });

  //     expect(response.status).toBe(500);
  //     expect(response.text).toContain('Error when saving post');
  //   });

  //   it('should return 500 when post saving fails', async () => {
  //     jest.setTimeout(10000);
  //     createRecipeSpy.mockResolvedValueOnce(mockRecipeResponse);
  //     savePostSpy.mockRejectedValueOnce(new Error('Error when saving post'));

  //     const response = await supertest(app)
  //       .post('/posts/addPost')
  //       .send({
  //         username: 'user1',
  //         recipe: {
  //           title: 'Test Recipe',
  //           ingredients: ['ing1', 'ing2'],
  //           instructions: ['step1', 'step2'],
  //           tags: ['test-tag']
  //         },
  //         text: 'Test post',
  //         datePosted: new Date(),
  //         likes: [],
  //         saves: []
  //       });

  //     expect(response.status).toBe(500);
  //     expect(response.text).toContain('Error when saving post');
  //   });
  // });

  describe('GET /posts/getPosts', () => {
    it('should return all posts successfully', async () => {
      getPostListSpy.mockResolvedValueOnce([mockPostResponse]);

      const response = await supertest(app).get('/posts/getPosts');

      expect(response.status).toBe(200);
    });

    it('should return 500 when getPostList returns an error', async () => {
      getPostListSpy.mockRejectedValueOnce(new Error('Error getting posts'));

      const response = await supertest(app).get('/posts/getPosts');

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when getting Posts');
    });
  });

  describe('GET /posts/getFollowingPosts/:username', () => {
    it('should return posts from followed users successfully', async () => {
      getFollowingPostListSpy.mockResolvedValueOnce([mockPostResponse]);

      const response = await supertest(app)
        .get(`/posts/getFollowingPosts/${mockPost.username}`);
      expect(response.status).toBe(200);
    });

    it('should return 500 when getFollowingPostList returns an error', async () => {
      getFollowingPostListSpy.mockRejectedValueOnce(new Error('error posting'));

      const response = await supertest(app)
        .get(`/posts/getFollowingPosts/${mockPost.username}`);
      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when getting posts from users that you follow');
    });
  });

  describe('PATCH /posts/updatePostLikes', () => {
    it('should successfully update post likes', async () => {
      const likeData = { postID: mockPostResponse._id, username: 'user2' };
      likePostSpy.mockResolvedValueOnce({ ...mockPostResponse, likes: [likeData.username] });

      const response = await supertest(app)
        .patch('/posts/updatePostLikes')
        .send(likeData);
      expect(response.status).toBe(200);
      expect(response.body.likes).toContain(likeData.username);
    });

    it('should return 500 when likePost returns an error', async () => {
      const likeData = { postID: mockPostResponse._id, username: 'user2' };
      likePostSpy.mockResolvedValueOnce({ error: 'Cannot update likes' });

      const response = await supertest(app)
        .patch('/posts/updatePostLikes')
        .send(likeData);
      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when updating post likes');
    });

    it('should return 500 when postID or username is missing', async () => {
      const response = await supertest(app)
        .patch('/posts/updatePostLikes')
        .send({});
      expect(response.status).toBe(500);
      expect(response.text).toContain('PostID and Username required');
    });
  });
});
