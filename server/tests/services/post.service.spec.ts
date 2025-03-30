import { ObjectId } from 'mongodb';
import { DatabasePost } from '@fake-stack-overflow/shared';
import { likePost } from '../../services/post.service';
import PostModel from '../../models/posts.model';
import { sampleLikedPost, samplePost, sampleRecipe, user } from '../mockData.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('Post Model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
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
    mockingoose(PostModel).toReturn(samplePost, 'findOne');
    mockingoose(PostModel).toReturn({ ...likedPost, likes: [user.username] }, 'findOneAndUpdate');

    const result = (await likePost(samplePost._id, user.username)) as DatabasePost;

    expect(result.likes).toContain(user.username);
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

    mockingoose(PostModel).toReturn(sampleLikedPost, 'findOne');
    mockingoose(PostModel).toReturn({ ...unlikedPost, likes: [] }, 'findOneAndUpdate');

    const result = (await likePost(sampleLikedPost._id, user.username)) as DatabasePost;

    expect(result.likes).not.toContain(user.username);
  });

  test('should return an error if the post is not found', async () => {
    mockingoose(PostModel).toReturn(null, 'findOne');

    const result = await likePost(samplePost._id, user.username);

    expect('error' in result).toBe(true);
  });

  test('should return an error if updating likes fails', async () => {
    mockingoose(PostModel).toReturn(samplePost, 'findOne');
    mockingoose(PostModel).toReturn(null, 'findOneAndUpdate');

    const result = await likePost(samplePost._id, user.username);

    expect('error' in result).toBe(true);
  });
});
