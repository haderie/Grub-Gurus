import React from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
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
      <Box>
        <VoteComponent question={question} />
      </Box>

      {/* Question Header Section */}
      <Box sx={{ marginBottom: 3 }}>
        <AnswerHeader ansCount={question.answers.length} title={question.title} />
      </Box>

      {/* Question Body Section */}
      <Box sx={{ marginBottom: 3 }}>
        <QuestionBody
          views={question.views.length}
          text={question.text}
          askby={question.askedBy}
          meta={getMetaData(new Date(question.askDateTime))}
          youtubeVideoUrl={question.youtubeVideoUrl}
        />
      </Box>

      {/* Comment Section */}
      <Box sx={{ marginBottom: 3 }}>
        <CommentSection
          comments={question.comments}
          handleAddComment={(comment: Comment) => handleNewComment(comment, 'question', questionID)}
        />
      </Box>

      <Divider sx={{ marginY: 3 }} />

      {/* Call to Action Section */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography
          variant='subtitle1'
          sx={{ fontWeight: 'bold', color: '#6A9C89', textAlign: 'center' }}>
          Answer the question or let Munchmaster generate an AI-driven response for you.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
          <Button
            variant='contained'
            color='primary'
            sx={{
              borderRadius: '5px',
              fontSize: '14px',
              textTransform: 'none',
              backgroundColor: '#FFF5E4',
              color: '#FFA725',
            }}
            onClick={handleNewAnswer}>
            ANSWER QUESTION
          </Button>
          <Button
            variant='contained'
            color='primary'
            sx={{
              borderRadius: '5px',
              fontSize: '14px',
              textTransform: 'none',
              backgroundColor: '#FFF5E4',
              color: '#FFA725',
            }}
            onClick={handleAIAnswer}>
            USE MUNCHMASTER AI
          </Button>
        </Box>
      </Box>

      <Divider sx={{ marginY: 3 }} />

      {/* Answer Sections */}
      <Box>
        {question.answers.map(a => (
          <Box key={String(a._id)} sx={{ marginBottom: 3 }}>
            <AnswerView
              text={a.text}
              ansBy={a.ansBy}
              meta={getMetaData(new Date(a.ansDateTime))}
              comments={a.comments}
              handleAddComment={(comment: Comment) =>
                handleNewComment(comment, 'answer', String(a._id))
              }
              youtubeVideoUrl={a.youtubeVideoUrl}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AnswerPage;
