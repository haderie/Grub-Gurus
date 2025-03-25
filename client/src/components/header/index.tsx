import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { TbChefHat } from 'react-icons/tb';
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
    <div id='header' className='header'>
      <div className='title'>Grub Gurus</div>
      <TextField
        id='searchBar'
        size='small'
        placeholder='Search questions...'
        value={val}
        variant='outlined'
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <Button variant='contained' color='error' onClick={handleSignOut} className='logout-button'>
        Log out
      </Button>
      <Button
        variant='contained'
        className='view-profile-button'
        onClick={() => navigate(`/user/${currentUser.username}`)}>
        {currentUser.username}
        <br />
        <TbChefHat />
      </Button>
    </div>
  );
};

export default Header;
