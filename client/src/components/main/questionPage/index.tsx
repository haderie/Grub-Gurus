import React from 'react';
import { Box, Typography } from '@mui/material';
import QuestionHeader from './header';
import QuestionView from './question';
import useQuestionPage from '../../../hooks/useQuestionPage';

/**
 * QuestionPage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const QuestionPage = () => {
  const { titleText, qlist, setQuestionOrder } = useQuestionPage();

  return (
    <Box sx={{ padding: 2 }}>
      {/* Question Header */}
      <QuestionHeader
        titleText={titleText}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
      />

      {/* Questions List */}
      <Box sx={{ marginTop: 1 }}>
        {qlist.length > 0 ? (
          qlist.map(q => (
            <Box key={String(q._id)}>
              <QuestionView question={q} />
            </Box>
          ))
        ) : (
          <Typography variant='h6' color='text.secondary'>
            No Questions Found
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default QuestionPage;
