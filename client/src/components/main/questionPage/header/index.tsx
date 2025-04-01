import React from 'react';
import { Box, Typography } from '@mui/material';
import './index.css';
import OrderButton from './orderButton';
import { OrderType } from '../../../../types/types';
import { orderTypeDisplayName } from '../../../../types/constants';
import AskQuestionButton from '../../askQuestionButton';
/**
 * Interface representing the props for the QuestionHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 * qcnt - The number of questions to be displayed in the header.
 * setQuestionOrder - A function that sets the order of questions based on the selected message.
 */
interface QuestionHeaderProps {
  titleText: string;
  qcnt: number;
  setQuestionOrder: (order: OrderType) => void;
}

/**
 * QuestionHeader component displays the header section for a list of questions.
 * It includes the title, a button to ask a new question, the number of the quesions,
 * and buttons to set the order of questions.
 *
 * @param titleText - The title text to display in the header.
 * @param qcnt - The number of questions displayed in the header.
 * @param setQuestionOrder - Function to set the order of questions based on input message.
 */
const QuestionHeader = ({ titleText, qcnt, setQuestionOrder }: QuestionHeaderProps) => (
  <Box sx={{ marginBottom: 3 }}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 3,
        marginTop: 3,
      }}>
      <Typography variant='h5' component='h1' sx={{ fontWeight: 'bold' }}>
        {titleText}
      </Typography>
      <AskQuestionButton />
    </Box>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 3,
      }}>
      <Typography variant='body1' sx={{ color: '#FFA725', fontWeight: 'bold', fontSize: '18px' }}>
        {qcnt} questions
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
        {Object.keys(orderTypeDisplayName).map(order => (
          <OrderButton
            key={order}
            orderType={order as OrderType}
            setQuestionOrder={setQuestionOrder}
          />
        ))}
      </Box>
    </Box>
  </Box>
);

export default QuestionHeader;
