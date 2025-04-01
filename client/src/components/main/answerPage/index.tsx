import React from 'react';
import { Box, Button } from '@mui/material';
import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment } from '../../../types/types';
import QuestionBody from './questionBody';
import VoteComponent from '../voteComponent';
import CommentSection from '../commentSection';
import useAnswerPage from '../../../hooks/useAnswerPage';

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage = () => {
  const { questionID, question, handleNewComment, handleNewAnswer, handleAIAnswer } =
    useAnswerPage();

  if (!question) {
    return null;
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* Vote Component Section */}
      <VoteComponent question={question} />

      {/* Question Header Section */}
      <AnswerHeader ansCount={question.answers.length} title={question.title} />

      {/* Question Body Section */}
      <QuestionBody
        views={question.views.length}
        text={question.text}
        askby={question.askedBy}
        meta={getMetaData(new Date(question.askDateTime))}
        youtubeVideoUrl={question.youtubeVideoUrl}
      />

      {/* Comment Section */}
      <CommentSection
        comments={question.comments}
        handleAddComment={(comment: Comment) => handleNewComment(comment, 'question', questionID)}
      />

      {/* Answer Sections */}
      {question.answers.map(a => (
        <AnswerView
          key={String(a._id)}
          text={a.text}
          ansBy={a.ansBy}
          meta={getMetaData(new Date(a.ansDateTime))}
          comments={a.comments}
          handleAddComment={(comment: Comment) =>
            handleNewComment(comment, 'answer', String(a._id))
          }
          youtubeVideoUrl={a.youtubeVideoUrl}
        />
      ))}

      {/* Button to Answer the Question */}
      <Box sx={{ display: 'flex', justifyContent: 'left', marginTop: 3 }}>
        <Button
          variant='contained'
          color='primary'
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            backgroundColor: '#6A9C89',
            color: '#FFF5E4',
          }}
          onClick={handleNewAnswer}>
          ANSWER QUESTION
        </Button>
      </Box>
      <button
        className='button'
        onClick={() => {
          handleAIAnswer();
        }}>
        Generate AI Answer
      </button>
    </Box>
  );
};

export default AnswerPage;
