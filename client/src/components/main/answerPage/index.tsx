import React from 'react';
import { Box, Button } from '@mui/material';
import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment, PopulatedDatabaseAnswer } from '../../../types/types';
import QuestionBody from './questionBody';
import VoteComponent from '../voteComponent';
import CommentSection from '../commentSection';
import useAnswerPage from '../../../hooks/useAnswerPage';

/**
 * Gets the newest answer from a list, sorted by the answer date in descending order with certified having priority.
 *
 * @param {PopulatedDatabaseAnswer[]} alist - The list of answers to sort
 *
 * @returns {PopulatedDatabaseAnswer[]} - The sorted list of answers by certified status date, with certified first sorted by newest first then non-certified by newest
 */
function sortAnswersByNewestAndCertified(
  alist: PopulatedDatabaseAnswer[],
): PopulatedDatabaseAnswer[] {
  alist.sort((a, b) => {
    // If one of the answers has a certified user and the other does, put the certified answer first
    if (a.isUserCertified && !b.isUserCertified) {
      return -1;
    }
    if (!a.isUserCertified && b.isUserCertified) {
      return 1;
    }

    // If both answers have the same type of user (certified or non-certified), sort based on which is newer
    if (a.ansDateTime > b.ansDateTime) {
      return -1;
    }
    if (a.ansDateTime < b.ansDateTime) {
      return 1;
    }

    return 0;
  });
  return alist;
}

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
      {sortAnswersByNewestAndCertified(question.answers).map(a => (
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
        GENERATE AI ANSWER
      </button>
    </Box>
  );
};

export default AnswerPage;
