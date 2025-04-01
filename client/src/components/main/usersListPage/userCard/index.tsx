import React from 'react';
import './index.css';
import { Box, Typography } from '@mui/material';
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
}

/**
 * User component renders the details of a user including its username and dateJoined.
 * Clicking on the component triggers the handleUserPage function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param user - The user object containing user details.
 */
const UserCardView = (props: UserProps) => {
  const { user, handleUserCardViewClickHandler } = props;

  return (
    <Box
      onClick={() => handleUserCardViewClickHandler(user)}
      sx={{
        'cursor': 'pointer',
        'padding': 3,
        'borderBottom': '1px solid #DDD',
        'display': 'flex',
        'justifyContent': 'space-between',
        'alignItems': 'center',
        'width': '100%',
        '&:hover': { backgroundColor: '#FFF5E4' },
      }}>
      <Typography variant='h6' fontWeight='bold' sx={{ color: '#6A9C89' }}>
        {user.username}
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        Joined {new Date(user.dateJoined).toUTCString()}
      </Typography>
    </Box>
  );
};

export default UserCardView;
