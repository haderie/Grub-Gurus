import mongoose from 'mongoose';
import UserModel from '../../models/users.model';
import {
  deleteUserByUsername,
  followUserService,
  getUserByUsername,
  getUsersList,
  loginUser,
  saveUser,
  unfollowUserService,
  updateUser,
} from '../../services/user.service';
import {
  SafeDatabaseUser,
  SafePopulatedDatabaseUser,
  User,
  UserCredentials,
} from '../../types/types';
import { user, safeUser, userFollowed } from '../mockData.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('User model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveUser', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the saved user', async () => {
      mockingoose(UserModel).toReturn(user, 'create');

      const savedUser = (await saveUser(user)) as SafeDatabaseUser;

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toEqual(user.username);
      expect(savedUser.dateJoined).toEqual(user.dateJoined);
    });

    it('should throw an error if error when saving to database', async () => {
      jest
        .spyOn(UserModel, 'create')
        .mockRejectedValueOnce(() => new Error('Error saving document'));

      const saveError = await saveUser(user);

      expect('error' in saveError).toBe(true);
    });
  });
});

describe('getUserByUsername', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the matching user', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOne');

    const retrievedUser = (await getUserByUsername(user.username)) as SafePopulatedDatabaseUser;

    expect(retrievedUser.username).toEqual(user.username);
    expect(retrievedUser.dateJoined).toEqual(user.dateJoined);
  });

  it('should throw an error if the user is not found', async () => {
    mockingoose(UserModel).toReturn(null, 'findOne');

    const getUserError = await getUserByUsername(user.username);

    expect('error' in getUserError).toBe(true);
  });

  it('should throw an error if there is an error while searching the database', async () => {
    mockingoose(UserModel).toReturn(new Error('Error finding document'), 'findOne');

    const getUserError = await getUserByUsername(user.username);

    expect('error' in getUserError).toBe(true);
  });
});

describe('getUsersList', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the users', async () => {
    mockingoose(UserModel).toReturn([safeUser], 'find');

    const retrievedUsers = (await getUsersList()) as SafePopulatedDatabaseUser[];

    expect(retrievedUsers[0].username).toEqual(safeUser.username);
    expect(retrievedUsers[0].dateJoined).toEqual(safeUser.dateJoined);
  });

  it('should throw an error if the users cannot be found', async () => {
    mockingoose(UserModel).toReturn(null, 'find');

    const getUsersError = await getUsersList();

    expect('error' in getUsersError).toBe(true);
  });

  it('should throw an error if there is an error while searching the database', async () => {
    mockingoose(UserModel).toReturn(new Error('Error finding document'), 'find');

    const getUsersError = await getUsersList();

    expect('error' in getUsersError).toBe(true);
  });
});

describe('loginUser', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the user if authentication succeeds', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOne');

    const credentials: UserCredentials = {
      username: user.username,
      password: user.password,
    };

    const loggedInUser = (await loginUser(credentials)) as SafeDatabaseUser;

    expect(loggedInUser.username).toEqual(user.username);
    expect(loggedInUser.dateJoined).toEqual(user.dateJoined);
  });

  it('should return the user if the password fails', async () => {
    mockingoose(UserModel).toReturn(null, 'findOne');

    const credentials: UserCredentials = {
      username: user.username,
      password: 'wrongPassword',
    };

    const loginError = await loginUser(credentials);

    expect('error' in loginError).toBe(true);
  });

  it('should return the user is not found', async () => {
    mockingoose(UserModel).toReturn(null, 'findOne');

    const credentials: UserCredentials = {
      username: 'wrongUsername',
      password: user.password,
    };

    const loginError = await loginUser(credentials);

    expect('error' in loginError).toBe(true);
  });
});

describe('deleteUserByUsername', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the deleted user when deleted succesfully', async () => {
    mockingoose(UserModel).toReturn(safeUser, 'findOneAndDelete');

    const deletedUser = (await deleteUserByUsername(user.username)) as SafeDatabaseUser;

    expect(deletedUser.username).toEqual(user.username);
    expect(deletedUser.dateJoined).toEqual(user.dateJoined);
  });

  it('should throw an error if the username is not found', async () => {
    mockingoose(UserModel).toReturn(null, 'findOneAndDelete');

    const deletedError = await deleteUserByUsername(user.username);

    expect('error' in deletedError).toBe(true);
  });

  it('should throw an error if a database error while deleting', async () => {
    mockingoose(UserModel).toReturn(new Error('Error deleting object'), 'findOneAndDelete');

    const deletedError = await deleteUserByUsername(user.username);

    expect('error' in deletedError).toBe(true);
  });
});

describe('updateUser', () => {
  const updatedUser: User = {
    ...user,
    password: 'newPassword',
  };

  const safeUpdatedUser: SafeDatabaseUser = {
    _id: new mongoose.Types.ObjectId(),
    username: user.username,
    dateJoined: user.dateJoined,
    certified: false,
    followers: [],
    following: [],
    privacySetting: 'Public',
    recipeBookPublic: false,
    postsCreated: [],
    rankings: [],
  };

  const updates: Partial<User> = {
    password: 'newPassword',
  };

  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should return the updated user when updated succesfully', async () => {
    mockingoose(UserModel).toReturn(safeUpdatedUser, 'findOneAndUpdate');

    const result = (await updateUser(user.username, updates)) as SafePopulatedDatabaseUser;

    expect(result.username).toEqual(user.username);
    expect(result.username).toEqual(updatedUser.username);
    expect(result.dateJoined).toEqual(user.dateJoined);
    expect(result.dateJoined).toEqual(updatedUser.dateJoined);
  });

  it('should throw an error if the username is not found', async () => {
    mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

    const updatedError = await updateUser(user.username, updates);

    expect('error' in updatedError).toBe(true);
  });

  it('should throw an error if a database error while deleting', async () => {
    mockingoose(UserModel).toReturn(new Error('Error updating object'), 'findOneAndUpdate');

    const updatedError = await updateUser(user.username, updates);

    expect('error' in updatedError).toBe(true);
  });

  it('should update the biography if the user is found', async () => {
    const newBio = 'This is a new biography';
    // Make a new partial updates object just for biography
    const biographyUpdates: Partial<User> = { biography: newBio };

    // Mock the DB to return a safe user (i.e., no password in results)
    mockingoose(UserModel).toReturn({ ...safeUpdatedUser, biography: newBio }, 'findOneAndUpdate');

    const result = await updateUser(user.username, biographyUpdates);

    // Check that the result is a SafeUser and the biography got updated
    if ('username' in result) {
      expect(result.biography).toEqual(newBio);
    } else {
      throw new Error('Expected a safe user, got an error object.');
    }
  });

  it('should return an error if biography update fails because user not found', async () => {
    // Simulate user not found
    mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

    const newBio = 'No user found test';
    const biographyUpdates: Partial<User> = { biography: newBio };
    const updatedError = await updateUser(user.username, biographyUpdates);

    expect('error' in updatedError).toBe(true);
  });
});

describe('followUserService', () => {
  test('a followed user should appear in the current users following', async () => {
    const mockFindOneReturn = jest.fn();

    mockFindOneReturn.mockImplementation(params => {
      if (params.getQuery().username === userFollowed.username) {
        return userFollowed;
      }

      return user;
    });
    mockingoose(UserModel).toReturn(mockFindOneReturn, 'findOne');

    const mockFindOneAndUpdateReturn = jest.fn();

    mockFindOneAndUpdateReturn.mockImplementation(params => {
      if (params.getQuery().username === userFollowed.username) {
        return { ...userFollowed, followers: ['user1'] };
      }

      return { ...user, following: ['user2'] };
    });
    mockingoose(UserModel).toReturn(mockFindOneAndUpdateReturn, 'findOneAndUpdate');

    const updatedUser = await followUserService(user.username, userFollowed.username);

    if ('error' in updatedUser) {
      expect(true).toBe(false); // this should not happen, so fail the test
    } else {
      expect(updatedUser.following).toContainEqual(userFollowed.username);
    }

    mockFindOneReturn.mockRestore();
    mockFindOneAndUpdateReturn.mockRestore();
  });

  test('should throw an error when trying to follow yourself', async () => {
    const username = 'user1';
    const usernameFollowed = 'user1';

    const result = await followUserService(username, usernameFollowed);

    expect(result).toEqual({
      error: 'Error while following user: user1: Error: Cannot follow yourself',
    });
  });

  test('should throw an error if one or both users do not exist', async () => {
    const mockFindOneReturn = jest.fn();

    mockFindOneReturn.mockImplementation(params => null);
    mockingoose(UserModel).toReturn(mockFindOneReturn, 'findOne');

    const username = 'user1';
    const usernameFollowed = 'nullUser';

    const result = await followUserService(username, usernameFollowed);

    expect(result).toEqual({
      error: 'Error while following user: nullUser: Error: One or both users not found',
    });
    mockFindOneReturn.mockRestore();
  });

  test('should throw an error if the user is already following the selected user', async () => {
    const mockFindOneReturn = jest.fn();

    mockFindOneReturn.mockImplementation(params => {
      if (params.getQuery().username === userFollowed.username) {
        return { ...userFollowed, followers: ['user1'] };
      }
      return { ...user, following: ['user2'] };
    });
    mockingoose(UserModel).toReturn(mockFindOneReturn, 'findOne');

    const result = await followUserService(user.username, userFollowed.username);

    expect(result).toEqual({
      error: 'Error while following user: user2: Error: You already follow user2',
    });

    mockFindOneReturn.mockRestore();
  });

  test('should throw an error if updating the database fails', async () => {
    const mockFindOneReturn = jest.fn();

    mockFindOneReturn.mockImplementation(params => {
      if (params.getQuery().username === userFollowed.username) {
        return userFollowed;
      }

      return user;
    });
    mockingoose(UserModel).toReturn(mockFindOneReturn, 'findOne');

    const mockFindOneAndUpdateReturn = jest.fn();

    mockFindOneAndUpdateReturn.mockImplementation(params => null);
    mockingoose(UserModel).toReturn(mockFindOneAndUpdateReturn, 'findOneAndUpdate');

    const result = await followUserService(user.username, userFollowed.username);

    expect(result).toEqual({
      error: 'Error while following user: user2: Error: Error updating following and followers',
    });

    mockFindOneReturn.mockRestore();
    mockFindOneAndUpdateReturn.mockRestore();
  });
});

describe('unfollowUserService', () => {
  test('should return updated user with new following list when unfollow is successful', async () => {
    const mockFindOneReturn = jest.fn();
    mockFindOneReturn.mockImplementation(params => {
      if (params.getQuery().username === 'user1') {
        return { ...user, following: ['user2'] }; // user1 is following user2
      }
      return { ...userFollowed, followers: ['user1'] };
    });
    mockingoose(UserModel).toReturn(mockFindOneReturn, 'findOne');

    const mockFindOneAndUpdateReturn = jest.fn();
    mockFindOneAndUpdateReturn.mockImplementation(params => {
      if (params.getQuery().username === 'user1') {
        return { ...user, following: [] }; // user1 no longer follows anyone
      }
      return { ...userFollowed, followers: [] }; // user2 no longer has followers
    });
    mockingoose(UserModel).toReturn(mockFindOneAndUpdateReturn, 'findOneAndUpdate');

    const updatedUser = await unfollowUserService(user.username, userFollowed.username);

    if ('error' in updatedUser) {
      expect(true).toBe(false); // this should not happen, so fail the test
    } else {
      expect(updatedUser.following).not.toContainEqual(userFollowed.username);
    }

    mockFindOneReturn.mockRestore();
    mockFindOneAndUpdateReturn.mockRestore();
  });

  test('should throw an error when trying to unfollow yourself', async () => {
    const result = await unfollowUserService(user.username, user.username);

    expect(result).toEqual({
      error: 'Error while unfollowing user: user1: Error: Cannot unfollow yourself',
    });
  });

  test('should throw an error if one or both users do not exist', async () => {
    const mockFindOneReturn = jest.fn();
    mockFindOneReturn.mockImplementation(params => null);
    mockingoose(UserModel).toReturn(mockFindOneReturn, 'findOne');

    const nullUser = 'nullUser';

    const result = await unfollowUserService(user.username, nullUser);

    expect(result).toEqual({
      error: 'Error while unfollowing user: nullUser: Error: One or both users not found',
    });

    mockFindOneReturn.mockRestore();
  });

  test('should throw an error if the user is not following the selected user', async () => {
    const mockFindOneReturn = jest.fn();
    mockFindOneReturn.mockImplementation(params => {
      if (params.getQuery().username === 'user1') {
        return user; // user1 is not following anyone
      }
      return userFollowed;
    });
    mockingoose(UserModel).toReturn(mockFindOneReturn, 'findOne');

    const result = await unfollowUserService(user.username, userFollowed.username);

    expect(result).toEqual({
      error: `Error while unfollowing user: user2: Error: You cannot unfollow ${userFollowed.username}, you do not follow them`,
    });

    mockFindOneReturn.mockRestore();
  });

  test('should throw an error if updating the database fails', async () => {
    const mockFindOneReturn = jest.fn();
    mockFindOneReturn.mockImplementation(params => ({ ...user, following: ['user2'] }));
    mockingoose(UserModel).toReturn(mockFindOneReturn, 'findOne');

    const mockFindOneAndUpdateReturn = jest.fn();
    mockFindOneAndUpdateReturn.mockImplementation(params => null);
    mockingoose(UserModel).toReturn(mockFindOneAndUpdateReturn, 'findOneAndUpdate');

    const result = await unfollowUserService(user.username, userFollowed.username);

    expect(result).toEqual({
      error: 'Error while unfollowing user: user2: Error: Error updating following and followers',
    });

    mockFindOneReturn.mockRestore();
    mockFindOneAndUpdateReturn.mockRestore();
  });
});
