import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Interface representing the props for the AnswerHeader component.
 *
 * - ansCount - The number of answers to display in the header.
 * - title - The title of the question or discussion thread.
 */
interface AnswerHeaderProps {
  ansCount: number;
  title: string;
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 * It includes the number of answers, the title of the question, and a button to ask a new question.
 *
 * @param ansCount The number of answers to display.
 * @param title The title of the question or discussion thread.
 */
const AnswerHeader = ({ ansCount, title }: AnswerHeaderProps) => (
  <Box
    id='answersHeader'
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      backgroundColor: '#f5f5f5',
      borderBottom: '1px solid #ddd',
    }}>
    <Box>
      {/* Display number of answers */}
      <Typography variant='subtitle1' sx={{ fontWeight: 'bold', color: '#3E3232' }}>
        {ansCount} answers
      </Typography>
      {/* Display question title */}
      <Typography variant='h5' sx={{ fontWeight: 'bold', marginTop: '8px', color: '#3E3232' }}>
        {title}
      </Typography>
    </Box>

    {/* Ask Question Button */}
    {/* <Box>
      <AskQuestionButton />
    </Box> */}
  </Box>
);

export default AnswerHeader;
