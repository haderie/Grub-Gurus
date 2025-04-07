import mongoose from 'mongoose';
import AnswerModel from '../../models/answers.model';
import QuestionModel from '../../models/questions.model';
import { saveAnswer, addAnswerToQuestion } from '../../services/answer.service';
import { DatabaseAnswer, DatabaseQuestion } from '../../types/types';
import { QUESTIONS, ans1, ans4 } from '../mockData.models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('Answer model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveAnswer', () => {
    test('saveAnswer should return the saved answer', async () => {
      const mockAnswer = {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-06'),
        comments: [],
        isUserCertified: false,
      };
      const mockDBAnswer = {
        ...mockAnswer,
        _id: new mongoose.Types.ObjectId(),
      };

      mockingoose(AnswerModel, 'create').toReturn(mockDBAnswer);

      const result = (await saveAnswer(mockAnswer)) as DatabaseAnswer;

      expect(result._id).toBeDefined();
      expect(result.text).toEqual(mockAnswer.text);
      expect(result.ansBy).toEqual(mockAnswer.ansBy);
      expect(result.ansDateTime).toEqual(mockAnswer.ansDateTime);
    });
  });

  describe('addAnswerToQuestion', () => {
    test('addAnswerToQuestion should return the updated question', async () => {
      const question: DatabaseQuestion = QUESTIONS.filter(
        q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
      )[0];

      jest
        .spyOn(QuestionModel, 'findOneAndUpdate')
        .mockResolvedValueOnce({ ...question, answers: [...question.answers, ans4._id] });

      const result = (await addAnswerToQuestion(
        '65e9b5a995b6c7045a30d823',
        ans4,
      )) as DatabaseQuestion;

      expect(result.answers.length).toEqual(4);
      expect(result.answers).toContain(ans4._id);
    });

    test('addAnswerToQuestion should return an object with error if findOneAndUpdate throws an error', async () => {
      mockingoose(QuestionModel).toReturn(new Error('error'), 'findOneAndUpdate');

      const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

      expect(result).toHaveProperty('error');
    });

    test('addAnswerToQuestion should return an object with error if findOneAndUpdate returns null', async () => {
      mockingoose(QuestionModel).toReturn(null, 'findOneAndUpdate');

      const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

      expect(result).toHaveProperty('error');
    });

    test('addAnswerToQuestion should throw an error if a required field is missing in the answer', async () => {
      const invalidAnswer: Partial<DatabaseAnswer> = {
        text: 'This is an answer text',
        ansBy: 'user123', // Missing ansDateTime
      };

      const qid = 'validQuestionId';

      expect(addAnswerToQuestion(qid, invalidAnswer as DatabaseAnswer)).resolves.toEqual({
        error: 'Error when adding answer to question',
      });
    });
  });

  describe('saveAnswer with YouTube Video', () => {
    test('should save an answer with a valid YouTube URL', async () => {
      const mockAnswer = {
        text: 'Test answer text',
        ansBy: 'testuser',
        ansDateTime: new Date(),
        comments: [],
        youtubeVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        isUserCertified: false
      };

      const mockDBAnswer = {
        ...mockAnswer,
        _id: new mongoose.Types.ObjectId(),
      };

      mockingoose(AnswerModel, 'create').toReturn(mockDBAnswer);

      const result = (await saveAnswer(mockAnswer)) as DatabaseAnswer;

      expect(result._id).toBeDefined();
      expect(result.youtubeVideoUrl).toBe(mockAnswer.youtubeVideoUrl);
    });

    test('should save an answer with different YouTube URL formats', async () => {
      const validUrls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtu.be/dQw4w9WgXcQ',
        'https://youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/v/dQw4w9WgXcQ',
        'https://www.youtube.com/embed/dQw4w9WgXcQ'
      ];

      for (const url of validUrls) {
        const mockAnswer = {
          text: 'Test answer text',
          ansBy: 'testuser',
          ansDateTime: new Date(),
          comments: [],
          youtubeVideoUrl: url,
          isUserCertified: false
        };

        const mockDBAnswer = {
          ...mockAnswer,
          _id: new mongoose.Types.ObjectId(),
        };

        mockingoose(AnswerModel, 'create').toReturn(mockDBAnswer);

        const result = (await saveAnswer(mockAnswer)) as DatabaseAnswer;

        expect(result._id).toBeDefined();
        expect(result.youtubeVideoUrl).toBe(url);
      }
    });

    test('should save an answer without a YouTube URL', async () => {
      const mockAnswer = {
        text: 'Test answer text',
        ansBy: 'testuser',
        ansDateTime: new Date(),
        comments: [],
        isUserCertified: false
      };

      const mockDBAnswer = {
        ...mockAnswer,
        _id: new mongoose.Types.ObjectId(),
      };

      mockingoose(AnswerModel, 'create').toReturn(mockDBAnswer);

      const result = (await saveAnswer(mockAnswer)) as DatabaseAnswer;

      expect(result._id).toBeDefined();
      expect(result.youtubeVideoUrl).toBeUndefined();
    });

    test('should add an answer with YouTube URL to a question', async () => {
      // Create a fixed ObjectId for testing
      const answerId = new mongoose.Types.ObjectId('67f2db6002fd37d9ced01605');
      
      const mockQuestion: DatabaseQuestion = QUESTIONS.filter(
        q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
      )[0];

      const mockAnswer = {
        text: 'Test answer text',
        ansBy: 'testuser',
        ansDateTime: new Date(),
        comments: [],
        youtubeVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        isUserCertified: false
      };

      const mockDBAnswer = {
        ...mockAnswer,
        _id: answerId,
      };

      // Mock the saveAnswer function to return our mockDBAnswer
      mockingoose(AnswerModel, 'create').toReturn(mockDBAnswer);
      
      // Mock the findOneAndUpdate to return the question with the new answer added
      const updatedQuestion = {
        ...mockQuestion,
        answers: [...mockQuestion.answers, answerId]
      };
      
      jest
        .spyOn(QuestionModel, 'findOneAndUpdate')
        .mockResolvedValueOnce(updatedQuestion);

      const savedAnswer = (await saveAnswer(mockAnswer)) as DatabaseAnswer;
      expect(savedAnswer._id).toBeDefined();
      expect(savedAnswer.youtubeVideoUrl).toBe(mockAnswer.youtubeVideoUrl);

      const result = await addAnswerToQuestion(mockQuestion._id.toString(), savedAnswer);
      expect('error' in result).toBe(false);
      if (!('error' in result)) {
        // Check if the answer ID is in the question's answers array
        const answerIds = result.answers.map(id => id.toString());
        expect(answerIds).toContain(answerId.toString());
      }
    });
  });
});
