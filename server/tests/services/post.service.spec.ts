import { ObjectId } from 'mongodb';
import { likePost, savePost, getPostList, getFollowingPostList } from '../../services/post.service';
import PostModel from '../../models/posts.model';
import UserModel from '../../models/users.model';
import { DatabasePost } from '../../types/types';
import { sampleLikedPost, samplePost, sampleRecipe, user } from '../mockData.models';
import mongoose from 'mongoose';

jest.mock('../../models/posts.model');
jest.mock('../../models/users.model');
jest.mock('../../models/recipe.models');
jest.mock('../../models/tags.model');
jest.mock('../../services/user.service');

describe('Post Model', () => {
  let findOneSpy: jest.SpyInstance;
  let findOneAndUpdateSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    findOneSpy = jest.spyOn(PostModel, 'findById');
    findOneAndUpdateSpy = jest.spyOn(PostModel, 'findOneAndUpdate');
  });

  test('should add a like to a post successfully', async () => {
    const likedPost = {
      _id: new ObjectId(),
      recipe: sampleRecipe._id,
      username: user.username,
      datePosted: new Date(),
      likes: ['user1'],
      saves: [],
    };

    findOneSpy.mockResolvedValueOnce(samplePost);
    findOneAndUpdateSpy.mockResolvedValueOnce({ ...likedPost, likes: [user.username] });

    const result = await likePost(samplePost._id, user.username);

    expect(result).not.toHaveProperty('error');
    const postResult = result as DatabasePost;
    expect(postResult.likes).toContain(user.username);
  });

  test('should remove a like from a post successfully', async () => {
    const unlikedPost = {
      _id: new ObjectId(),
      recipe: sampleRecipe._id,
      username: user.username,
      datePosted: new Date(),
      likes: [],
      saves: [],
    };

    findOneSpy.mockResolvedValueOnce(sampleLikedPost);
    findOneAndUpdateSpy.mockResolvedValueOnce({ ...unlikedPost, likes: [] });

    const result = await likePost(sampleLikedPost._id, user.username);

    expect(result).not.toHaveProperty('error');
    const postResult = result as DatabasePost;
    expect(postResult.likes).not.toContain(user.username);
  });

  test('should return an error if the post is not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const result = await likePost(samplePost._id, user.username);

    expect(result).toHaveProperty('error');
  });

  test('should return an error if updating likes fails', async () => {
    findOneSpy.mockResolvedValueOnce(samplePost);
    findOneAndUpdateSpy.mockResolvedValueOnce(null);

    const result = await likePost(samplePost._id, user.username);

    expect(result).toHaveProperty('error');
  });
});

describe('Post Service', () => {
  const mockPostID = new mongoose.Types.ObjectId();
  const mockRecipeID = new mongoose.Types.ObjectId();
  const mockTagID = new mongoose.Types.ObjectId();

  const mockPost = {
    _id: mockPostID,
    username: 'user1',
    recipe: mockRecipeID,
    text: 'Test post',
    datePosted: new Date(),
    likes: [],
    saves: [],
  };

  const mockRecipe = {
    _id: mockRecipeID,
    title: 'Test Recipe',
    ingredients: ['ing1', 'ing2'],
    instructions: ['step1', 'step2'],
    tags: [mockTagID],
  };

  const mockTag = {
    _id: mockTagID,
    name: 'test-tag',
  };

  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    username: 'user1',
    dateJoined: new Date(),
    certified: false,
    followers: [],
    following: ['user2'],
    privacySetting: 'Public',
    recipeBookPublic: false,
    postsCreated: [],
  };

  let createSpy: jest.SpyInstance;
  let findOneAndUpdateSpy: jest.SpyInstance;
  let findSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;
  let getUserByUsernameSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    createSpy = jest.spyOn(PostModel, 'create');
    findOneAndUpdateSpy = jest.spyOn(UserModel, 'findOneAndUpdate');
    findSpy = jest.spyOn(PostModel, 'find');
    findOneSpy = jest.spyOn(UserModel, 'findOne');
    getUserByUsernameSpy = jest.spyOn(require('../../services/user.service'), 'getUserByUsername');
  });

  describe('savePost', () => {
    it('should successfully save a post and update user', async () => {
      createSpy.mockResolvedValueOnce(mockPost);
      findOneAndUpdateSpy.mockResolvedValueOnce(mockUser);

      const result = await savePost(mockPost);

      expect(result).toEqual(mockPost);
      expect(createSpy).toHaveBeenCalledWith(mockPost);
      expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
        { username: mockPost.username },
        { $push: { postsCreated: mockPost } },
        { new: true }
      );
    });

    it('should throw error when post creation fails', async () => {
      createSpy.mockRejectedValueOnce(new Error('Database error'));

      await expect(savePost(mockPost)).rejects.toThrow('Post could not be saved: Error: Database error');
    });
  });

  describe('getPostList', () => {
    it('should return all public posts with populated recipe and tags', async () => {
      const populatedPost = {
        ...mockPost,
        recipe: mockRecipe,
      };

      // Mock the PostModel.find() chain
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([populatedPost]),
      };
      findSpy.mockReturnValue(mockFind);

      // Mock the UserModel.findOne() chain
      const mockFindOne = {
        lean: jest.fn().mockResolvedValue(mockUser),
      };
      findOneSpy.mockReturnValue(mockFindOne);

      const result = await getPostList();

      expect(result).toEqual([populatedPost]);
      expect(findSpy).toHaveBeenCalled();
      expect(findOneSpy).toHaveBeenCalledWith({ username: mockPost.username });
    });

    it('should filter out posts from private users', async () => {
      const privateUser = {
        ...mockUser,
        privacySetting: 'Private',
      };

      // Mock the PostModel.find() chain
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([mockPost]),
      };
      findSpy.mockReturnValue(mockFind);

      // Mock the UserModel.findOne() chain
      const mockFindOne = {
        lean: jest.fn().mockResolvedValue(privateUser),
      };
      findOneSpy.mockReturnValue(mockFindOne);

      const result = await getPostList();

      expect(result).toEqual([]);
    });

    it('should throw error when posts cannot be retrieved', async () => {
      // Mock the PostModel.find() chain
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(null),
      };
      findSpy.mockReturnValue(mockFind);

      await expect(getPostList()).rejects.toThrow('Posts could not be retrieved');
    });
  });

  describe('getFollowingPostList', () => {
    it('should return posts from followed users', async () => {
      const mockUser2 = {
        ...mockUser,
        username: 'user2',
      };

      getUserByUsernameSpy.mockResolvedValueOnce(mockUser);

      // Mock the PostModel.find() chain
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([mockPost]),
      };
      findSpy.mockReturnValue(mockFind);

      const result = await getFollowingPostList('user1');

      expect(result).toEqual([mockPost]);
      expect(getUserByUsernameSpy).toHaveBeenCalledWith('user1');
      expect(findSpy).toHaveBeenCalledWith({
        username: { $in: [...mockUser.following, 'user1'] },
      });
    });

    it('should throw error when user is not found', async () => {
      getUserByUsernameSpy.mockResolvedValueOnce({ error: 'User not found' });

      await expect(getFollowingPostList('nonexistent')).rejects.toThrow('User not found');
    });

    it('should throw error when posts cannot be retrieved', async () => {
      getUserByUsernameSpy.mockResolvedValueOnce(mockUser);

      // Mock the PostModel.find() chain
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(null),
      };
      findSpy.mockReturnValue(mockFind);

      await expect(getFollowingPostList('user1')).rejects.toThrow('Posts could not be retrieved');
    });
  });
});
