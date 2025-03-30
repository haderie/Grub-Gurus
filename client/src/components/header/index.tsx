import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TbChefHat } from 'react-icons/tb';
import { CiSearch } from 'react-icons/ci';
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
      <div className='left-section'>
        <div className='title'>Grub Gurus</div>
      </div>
      <div className='right-section'>
        <div className='search-container'>
          <CiSearch className='search-icon' />
          <input
            type='text'
            id='searchBar'
            placeholder='Search questions...'
            value={val}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className='search-input'
          />
        </div>
        <button onClick={handleSignOut} className='logout-button'>
          Log out
        </button>
        <button
          className='view-profile-button'
          onClick={() => navigate(`/user/${currentUser.username}`)}>
          {currentUser.username} {''}
          <TbChefHat />
        </button>
      </div>
    </div>
  );
};

export default Header;
