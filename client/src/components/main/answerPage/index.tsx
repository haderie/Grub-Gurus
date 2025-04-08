import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment, PopulatedDatabaseAnswer } from '../../../types/types';
import QuestionBody from './questionBody';
import VoteComponent from '../voteComponent';
import CommentSection from '../commentSection';
import useAnswerPage from '../../../hooks/useAnswerPage';
import { getUsers } from '../../../services/userService';

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage = () => {
  const { questionID, question, handleNewComment, handleNewAnswer, handleAIAnswer } =
    useAnswerPage();

  const [certifiedUsernames, setCertifiedUsernames] = useState<string[]>([]); // State to hold certified usernames

  // Fetch certified users asynchronously
  useEffect(() => {
    const fetchCertifiedUsers = async () => {
      const userList = await getUsers(); // Fetch users
      const certifiedUserList = userList.filter(user => user.certified === true); // Filter for certified users
      const certifiedUsernameList = certifiedUserList.map(u => u.username); // Get the list of certified usernames
      setCertifiedUsernames(certifiedUsernameList); // Update state
    };

    fetchCertifiedUsers(); // Call the async function
  }, []); // Run once when the component mounts

  // Function to sort answers
  function sortAnswersByNewestAndCertified(
    alist: PopulatedDatabaseAnswer[],
  ): PopulatedDatabaseAnswer[] {
    alist.sort((a, b) => {
      const isACertified = certifiedUsernames.includes(a.ansBy); // Check if user is certified by username
      const isBCertified = certifiedUsernames.includes(b.ansBy);

      // If one of the answers has a certified user and the other does not, put the certified answer first
      if (isACertified && !isBCertified) {
        return -1;
      }
      if (!isACertified && isBCertified) {
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
