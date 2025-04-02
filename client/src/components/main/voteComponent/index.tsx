import { IoArrowUpCircleOutline, IoArrowDownCircleOutline } from 'react-icons/io5';
import { downvoteQuestion, upvoteQuestion } from '../../../services/questionService';
import './index.css';
import useUserContext from '../../../hooks/useUserContext';
import { PopulatedDatabaseQuestion } from '../../../types/types';
import useVoteStatus from '../../../hooks/useVoteStatus';

/**
 * Interface represents the props for the VoteComponent.
 *
 * question - The question object containing voting information.
 */
interface VoteComponentProps {
  question: PopulatedDatabaseQuestion;
}

/**
 * A Vote component that allows users to upvote or downvote a question.
 *
 * @param question - The question object containing voting information.
 */
const VoteComponent = ({ question }: VoteComponentProps) => {
  const { user } = useUserContext();
  const { count, voted } = useVoteStatus({ question });

  /**
   * Function to handle upvoting or downvoting a question.
   *
   * @param type - The type of vote, either 'upvote' or 'downvote'.
   */
  const handleVote = async (type: string) => {
    try {
      if (question._id) {
        if (type === 'upvote') {
          await upvoteQuestion(question._id, user.username);
        } else if (type === 'downvote') {
          await downvoteQuestion(question._id, user.username);
        }
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className='vote-container'>
      <div className='vote-buttons'>
        <button
          className={`vote-button upvote ${voted === 1 ? 'upvoted' : ''}`}
          onClick={() => handleVote('upvote')}>
          <IoArrowUpCircleOutline size={40} color={voted === 1 ? '#6A9C89' : '#3E3232'} />
        </button>
        <button
          className={`vote-button downvote ${voted === -1 ? 'downvoted' : ''}`}
          onClick={() => handleVote('downvote')}>
          <IoArrowDownCircleOutline size={40} color={voted === -1 ? 'red' : '#3E3232'} />
        </button>
      </div>
      <span className='vote-count'>{count}</span>
    </div>
  );
};

export default VoteComponent;
