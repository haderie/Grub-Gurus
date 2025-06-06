import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, IconButton, Box, Typography } from '@mui/material';
import { TbChefHat } from 'react-icons/tb';
import { MdLogout } from 'react-icons/md';
import useHeader from '../../hooks/useHeader';
import './index.css';
import useUserContext from '../../hooks/useUserContext';

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown, handleSignOut } = useHeader();
  const { user: currentUser } = useUserContext();
  const navigate = useNavigate();

  return (
    <Box
      id='header'
      className='header'
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        width: '100%',
        color: '#3E3232',
      }}>
      <Typography variant='h5' sx={{ marginLeft: '25px', fontWeight: 'bold' }}>
        Grub Gurus
      </Typography>
      {/* Title aligned to the left */}
      <img src='/grubGurus_logo.png' alt='Grub Gurus Logo' className='header-logo'></img>

      {/* Search Bar in the center */}
      <Box
        sx={{
          'flex': 1,
          'display': 'flex',
          'justifyContent': 'center',
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#6A9C89', // Set custom border color on focus
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#6A9C89', // Set custom label color on focus
          },
        }}>
        <TextField
          id='searchBar'
          size='small'
          placeholder='Search questions.'
          value={val}
          variant='outlined'
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          sx={{ width: '50%', borderColor: '#6A9C89' }}
        />
      </Box>

      {/* Buttons aligned to the right */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          variant='contained'
          onClick={() => navigate(`/user/${currentUser.username}`)}
          startIcon={<TbChefHat />}
          sx={{
            marginRight: 2,
            backgroundColor: '#6A9C89',
            color: '#FFF5E4',
            fontsize: '16px',
            borderRadius: '5px',
          }}>
          {currentUser.username}
        </Button>
        <IconButton
          color='error'
          onClick={handleSignOut}
          sx={{ color: '#FFA725', fontSize: '35px' }}>
          <MdLogout />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;
