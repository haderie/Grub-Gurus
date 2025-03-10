import React from 'react';
import './index.css';
import { SafeDatabaseUser } from '../../../../types/types';

/**
 * Interface representing the props for the User component.
 *
 * user - The user object containing details about the user.
 * handleUserCardViewClickHandler - The function to handle the click event on the user card.
 */
interface UserProps {
  user: SafeDatabaseUser;
  handleUserCardViewClickHandler: (user: SafeDatabaseUser) => void;
  handleFollowUser: (username: string) => void;
  isFollowed: boolean;
}

/**
 * User component renders the details of a user including its username and dateJoined.
 * Clicking on the component triggers the handleUserPage function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param user - The user object containing user details.
 */
const UserCardView = (props: UserProps) => {
  const { user, handleUserCardViewClickHandler, handleFollowUser, isFollowed } = props;

  const handleFollowClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    handleFollowUser(user.username); // Follow/unfollow the user
  };

  return (
    <div className='user right_padding' onClick={() => handleUserCardViewClickHandler(user)}>
      <div className='user_mid'>
        <div className='userUsername'>{user.username}</div>
      </div>
      <div className='userStats'>
        <div>joined {new Date(user.dateJoined).toUTCString()}</div>
        <button onClick={handleFollowClick}>{isFollowed ? 'Unfollow' : 'Follow'}</button>
      </div>
    </div>
  );
};

export default UserCardView;
