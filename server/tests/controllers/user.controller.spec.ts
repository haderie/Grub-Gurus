import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import * as util from '../../services/user.service';
import { SafeDatabaseUser, SafePopulatedDatabaseUser, User } from '../../types/types';

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
};

const mockSafeUser: SafeDatabaseUser = {
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
};

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
};

const mockUpdatedUser = {
  ...mockSafeUser,
  following: ['user2'],
};

const mockUserJSONResponse = {
  _id: mockSafeUser._id.toString(),
  username: 'user1',
  dateJoined: new Date('2024-12-03').toISOString(),
  certified: false,
  followers: [],
  following: [],
  postsCreated: [],
  privacySetting: 'Public',
  recipeBookPublic: false,
  highScore: 0,
};

const mockPopulatedUserJSONResponse = {
  _id: mockSafePopulatedUser._id.toString(),
  username: 'user1',
  dateJoined: new Date('2024-12-03').toISOString(),
  certified: false,
  followers: [],
  following: [],
  postsCreated: [],
  privacySetting: 'Public',
  recipeBookPublic: false,
  highScore: 0,
};

const mockCertifiedPopulatedUserJSONResponse = {
  _id: mockSafePopulatedUser._id.toString(),
  username: 'user1',
  dateJoined: new Date('2024-12-03').toISOString(),
  certified: true,
  followers: [],
  following: [],
  postsCreated: [],
  privacySetting: 'Public',
  recipeBookPublic: false,
  highScore: 0,
};

const mockNewHighScorePopulatedUserJSONResponse = {
  _id: mockSafePopulatedUser._id.toString(),
  username: 'user1',
  dateJoined: new Date('2024-12-03').toISOString(),
  certified: false,
  followers: [],
  following: [],
  postsCreated: [],
  privacySetting: 'Public',
  recipeBookPublic: false,
  highScore: 100,
};

const saveUserSpy = jest.spyOn(util, 'saveUser');
const loginUserSpy = jest.spyOn(util, 'loginUser');
const updatedUserSpy = jest.spyOn(util, 'updateUser');
const getUserByUsernameSpy = jest.spyOn(util, 'getUserByUsername');
const getUsersListSpy = jest.spyOn(util, 'getUsersList');
const deleteUserByUsernameSpy = jest.spyOn(util, 'deleteUserByUsername');

const followUserServiceSpy = jest.spyOn(util, 'followUserService');
const unfollowUserServiceSpy = jest.spyOn(util, 'unfollowUserService');

describe('Test userController', () => {
  describe('POST /signup', () => {
    it('should create a new user given correct arguments', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: mockUser.password,
        biography: 'This is a test biography',
      };

      saveUserSpy.mockResolvedValueOnce({ ...mockSafeUser, biography: mockReqBody.biography });

      const response = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...mockUserJSONResponse, biography: mockReqBody.biography });
    });

    it('should return 400 for request missing username', async () => {
      const mockReqBody = {
        password: mockUser.password,
      };

      const response = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request with empty username', async () => {
      const mockReqBody = {
        username: '',
        password: mockUser.password,
      };

      const response = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request missing password', async () => {
      const mockReqBody = {
        username: mockUser.username,
      };

      const response = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request with empty password', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: '',
      };

      const response = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 500 for a database error while saving', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: mockUser.password,
      };

      saveUserSpy.mockResolvedValueOnce({ error: 'Error saving user' });

      const response = await supertest(app).post('/user/signup').send(mockReqBody);

      expect(response.status).toBe(500);
    });
  });

  describe('POST /login', () => {
    it('should succesfully login for a user given correct arguments', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: mockUser.password,
      };

      loginUserSpy.mockResolvedValueOnce(mockSafeUser);

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserJSONResponse);
      expect(loginUserSpy).toHaveBeenCalledWith(mockReqBody);
    });

    it('should return 400 for request missing username', async () => {
      const mockReqBody = {
        password: mockUser.password,
      };

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request with empty username', async () => {
      const mockReqBody = {
        username: '',
        password: mockUser.password,
      };

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request missing password', async () => {
      const mockReqBody = {
        username: mockUser.username,
      };

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request with empty password', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: '',
      };

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 500 for a database error while saving', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: mockUser.password,
      };

      loginUserSpy.mockResolvedValueOnce({ error: 'Error authenticating user' });

      const response = await supertest(app).post('/user/login').send(mockReqBody);

      expect(response.status).toBe(500);
    });
  });

  describe('POST /resetPassword', () => {
    it('should succesfully return updated user object given correct arguments', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: 'newPassword',
      };

      updatedUserSpy.mockResolvedValueOnce(mockSafePopulatedUser);

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...mockPopulatedUserJSONResponse });
      expect(updatedUserSpy).toHaveBeenCalledWith(mockUser.username, { password: 'newPassword' });
    });

    it('should return 400 for request missing username', async () => {
      const mockReqBody = {
        password: 'newPassword',
      };

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request with empty username', async () => {
      const mockReqBody = {
        username: '',
        password: 'newPassword',
      };

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request missing password', async () => {
      const mockReqBody = {
        username: mockUser.username,
      };

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request with empty password', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: '',
      };

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 500 for a database error while updating', async () => {
      const mockReqBody = {
        username: mockUser.username,
        password: 'newPassword',
      };

      updatedUserSpy.mockResolvedValueOnce({ error: 'Error updating user' });

      const response = await supertest(app).patch('/user/resetPassword').send(mockReqBody);

      expect(response.status).toBe(500);
    });
  });

  describe('GET /getUser', () => {
    it('should return the user given correct arguments', async () => {
      getUserByUsernameSpy.mockResolvedValueOnce(mockSafePopulatedUser);

      const response = await supertest(app).get(`/user/getUser/${mockUser.username}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPopulatedUserJSONResponse);
      expect(getUserByUsernameSpy).toHaveBeenCalledWith(mockUser.username);
    });

    it('should return 500 if database error while searching username', async () => {
      getUserByUsernameSpy.mockResolvedValueOnce({ error: 'Error finding user' });

      const response = await supertest(app).get(`/user/getUser/${mockUser.username}`);

      expect(response.status).toBe(500);
    });

    it('should return 404 if username not provided', async () => {
      // Express automatically returns 404 for missing parameters when
      // defined as required in the route
      const response = await supertest(app).get('/user/getUser/');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /getUsers', () => {
    it('should return the users from the database', async () => {
      getUsersListSpy.mockResolvedValueOnce([mockSafePopulatedUser]);

      const response = await supertest(app).get(`/user/getUsers`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockPopulatedUserJSONResponse]);
      expect(getUsersListSpy).toHaveBeenCalled();
    });

    it('should return 500 if database error while finding users', async () => {
      getUsersListSpy.mockResolvedValueOnce({ error: 'Error finding users' });

      const response = await supertest(app).get(`/user/getUsers`);

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /deleteUser', () => {
    it('should return the deleted user given correct arguments', async () => {
      deleteUserByUsernameSpy.mockResolvedValueOnce(mockSafeUser);

      const response = await supertest(app).delete(`/user/deleteUser/${mockUser.username}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserJSONResponse);
      expect(deleteUserByUsernameSpy).toHaveBeenCalledWith(mockUser.username);
    });

    it('should return 500 if database error while searching username', async () => {
      deleteUserByUsernameSpy.mockResolvedValueOnce({ error: 'Error deleting user' });

      const response = await supertest(app).delete(`/user/deleteUser/${mockUser.username}`);

      expect(response.status).toBe(500);
    });

    it('should return 404 if username not provided', async () => {
      // Express automatically returns 404 for missing parameters when
      // defined as required in the route
      const response = await supertest(app).delete('/user/deleteUser/');
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /updateBiography', () => {
    it('should successfully update biography given correct arguments', async () => {
      const mockReqBody = {
        username: mockUser.username,
        biography: 'This is my new bio',
      };

      // Mock a successful updateUser call
      updatedUserSpy.mockResolvedValueOnce(mockSafePopulatedUser);

      const response = await supertest(app).patch('/user/updateBiography').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPopulatedUserJSONResponse);
      // Ensure updateUser is called with the correct args
      expect(updatedUserSpy).toHaveBeenCalledWith(mockUser.username, {
        biography: 'This is my new bio',
      });
    });

    it('should return 400 for request missing username', async () => {
      const mockReqBody = {
        biography: 'some new biography',
      };

      const response = await supertest(app).patch('/user/updateBiography').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request with empty username', async () => {
      const mockReqBody = {
        username: '',
        biography: 'a new bio',
      };

      const response = await supertest(app).patch('/user/updateBiography').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request missing biography field', async () => {
      const mockReqBody = {
        username: mockUser.username,
      };

      const response = await supertest(app).patch('/user/updateBiography').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 500 if updateUser returns an error', async () => {
      const mockReqBody = {
        username: mockUser.username,
        biography: 'Attempting update biography',
      };

      // Simulate a DB error
      updatedUserSpy.mockResolvedValueOnce({ error: 'Error updating user' });

      const response = await supertest(app).patch('/user/updateBiography').send(mockReqBody);

      expect(response.status).toBe(500);
      expect(response.text).toContain(
        'Error when updating user biography: Error: Error updating user',
      );
    });
  });

  describe('PATCH /updateCertifiedStatus', () => {
    it('should successfully update certficiation given correct arguments', async () => {
      const mockReqBody = {
        username: mockUser.username,
        certified: true,
      };

      // Mock a successful updateUser call
      updatedUserSpy.mockResolvedValueOnce({ ...mockSafePopulatedUser, certified: true });

      const response = await supertest(app).patch('/user/updateCertifiedStatus').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCertifiedPopulatedUserJSONResponse);
      // Ensure updateUser is called with the correct args
      expect(updatedUserSpy).toHaveBeenCalledWith(mockUser.username, {
        certified: true,
      });
    });

    it('should return 400 for request missing username', async () => {
      const mockReqBody = {
        certified: true,
      };

      const response = await supertest(app).patch('/user/updateCertifiedStatus').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request with empty username', async () => {
      const mockReqBody = {
        username: '',
        certified: true,
      };

      const response = await supertest(app).patch('/user/updateCertifiedStatus').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request missing certified field', async () => {
      const mockReqBody = {
        username: mockUser.username,
      };

      const response = await supertest(app).patch('/user/updateCertifiedStatus').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 500 if updateUser returns an error', async () => {
      const mockReqBody = {
        username: mockUser.username,
        certified: true,
      };

      // Simulate a DB error
      updatedUserSpy.mockResolvedValueOnce({ error: 'Error updating user' });

      const response = await supertest(app).patch('/user/updateCertifiedStatus').send(mockReqBody);

      expect(response.status).toBe(500);
    });
  });

  describe('PATCH /updateHighScore', () => {
    it('should successfully update high score given correct arguments', async () => {
      const mockReqBody = {
        username: mockUser.username,
        highScore: 0,
      };

      // Mock a successful updateUser call
      updatedUserSpy.mockResolvedValueOnce({ ...mockSafePopulatedUser, highScore: 100 });

      const response = await supertest(app).patch('/user/updateHighScore').send(mockReqBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockNewHighScorePopulatedUserJSONResponse);
      // Ensure updateUser is called with the correct args
      expect(updatedUserSpy).toHaveBeenCalledWith(mockUser.username, {
        highScore: 100,
      });
    });

    it('should return 400 for request missing username', async () => {
      const mockReqBody = {
        highScore: 100,
      };

      const response = await supertest(app).patch('/user/updateHighScore').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request with empty username', async () => {
      const mockReqBody = {
        username: '',
        highScore: 100,
      };

      const response = await supertest(app).patch('/user/updateHighScore').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 400 for request missing high score field', async () => {
      const mockReqBody = {
        username: mockUser.username,
      };

      const response = await supertest(app).patch('/user/updateHighScore').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Invalid user body');
    });

    it('should return 500 if updateUser returns an error', async () => {
      const mockReqBody = {
        username: mockUser.username,
        highScore: 100,
      };

      // Simulate a DB error
      updatedUserSpy.mockResolvedValueOnce({ error: 'Error updating user' });

      const response = await supertest(app).patch('/user/updateHighScore').send(mockReqBody);

      expect(response.status).toBe(500);
    });
  });

  describe('PATCH /followUser', () => {
    test('should successfully follow a user', async () => {
      getUserByUsernameSpy.mockResolvedValueOnce(mockSafePopulatedUser);
      followUserServiceSpy.mockResolvedValueOnce(mockUpdatedUser);

      const response = await supertest(app).patch('/user/followUser').send({
        username: 'user1',
        usernameFollowed: 'user2',
      });

      expect(response.status).toBe(200);
      expect(response.body.following).toContainEqual('user2');
      expect(followUserServiceSpy).toHaveBeenCalledWith('user1', 'user2');
    });

    test('should successfully unfollow a user', async () => {
      getUserByUsernameSpy.mockResolvedValueOnce({
        ...mockSafePopulatedUser,
        following: ['user2'],
      });
      unfollowUserServiceSpy.mockResolvedValueOnce(mockSafeUser);

      const response = await supertest(app).patch('/user/followUser').send({
        username: 'user1',
        usernameFollowed: 'user2',
      });

      expect(response.status).toBe(200);
      expect(response.body.followers).toEqual([]);
      expect(unfollowUserServiceSpy).toHaveBeenCalledWith('user1', 'user2');
    });

    test('should return 500 error when trying to follow yourself', async () => {
      const response = await supertest(app).patch('/user/followUser').send({
        username: 'user1',
        usernameFollowed: 'user1',
      });

      expect(response.status).toBe(500);
      expect(response.text).toContain(
        'Error when following user1: Error: You cannot follow yourself',
      );
    });

    test('should return 500 error if follow service fails', async () => {
      getUserByUsernameSpy.mockResolvedValueOnce(mockSafePopulatedUser);
      followUserServiceSpy.mockResolvedValueOnce({ error: 'Database error' });

      const response = await supertest(app).patch('/user/followUser').send({
        username: 'user1',
        usernameFollowed: 'user2',
      });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when following user2: Error: Database error');
    });

    test('should return 500 error if failure', async () => {
      getUserByUsernameSpy.mockResolvedValueOnce(mockSafePopulatedUser);
      followUserServiceSpy.mockRejectedValueOnce(new Error());

      const response = await supertest(app).patch('/user/followUser').send({
        username: 'user1',
        usernameFollowed: 'user2',
      });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error when following user2: Error');
    });
  });
});
