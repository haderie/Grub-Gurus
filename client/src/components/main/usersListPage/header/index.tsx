import React from 'react';
import './index.css';
import { Box, Typography, TextField } from '@mui/material';
import useUserSearch from '../../../../hooks/useUserSearch';

/**
 * Interface representing the props for the UserHeader component.
 *
 * userCount - The number of users to be displayed in the header.
 * setUserFilter - A function that sets the search bar filter value.
 */
interface UserHeaderProps {
  userCount: number;
  setUserFilter: (search: string) => void;
}

/**
 * UsersListHeader component displays the header section for a list of users.
 * It includes the title and search bar to filter the user.
 * Username search is case-sensitive.
 *
 * @param userCount - The number of users displayed in the header.
 * @param setUserFilter - Function that sets the search bar filter value.
 */
const UsersListHeader = ({ userCount, setUserFilter }: UserHeaderProps) => {
  const { val, handleInputChange } = useUserSearch(setUserFilter);

  return (
    <Box sx={{ padding: '16px 24px', borderBottom: '2px solid #DDD' }}>
      {/* Top Row: Title & Search */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant='h5' fontWeight='bold' sx={{ color: '#6A9C89' }}>
          Users List
        </Typography>
        <TextField
          id='user_search_bar'
          variant='outlined'
          placeholder='Search by username.'
          value={val}
          onChange={handleInputChange}
          size='small'
          sx={{ width: '250px', backgroundColor: 'white' }}
        />
      </Box>

      {/* Bottom Row: User Count */}
      <Typography variant='body1' sx={{ color: '#FFA725', fontWeight: 'bold', fontSize: '20px' }}>
        {userCount} users
      </Typography>
    </Box>
  );
};

export default UsersListHeader;
