import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { TbChefHat } from 'react-icons/tb';
import { PiCookingPotBold } from 'react-icons/pi';
import { IoMdArrowRoundForward } from 'react-icons/io';
import useAuth from '../../../hooks/useAuth';

/**
 * Renders a login form with username and password inputs, password visibility toggle,
 * error handling, and a link to the signup page.
 */
const Login = () => {
  const {
    username,
    password,
    showPassword,
    err,
    handleSubmit,
    handleInputChange,
    togglePasswordVisibility,
  } = useAuth('login');

  return (
    <div className='login-container'>
      <h2>Welcome to Grub Gurus!</h2>
      <h3>Login to Start Munchin&#39;</h3>
      <form onSubmit={handleSubmit}>
        <h4>
          Please enter your chef name <TbChefHat />
        </h4>
        <input
          type='text'
          value={username}
          onChange={event => handleInputChange(event, 'username')}
          placeholder='Username'
          required
          className='input-text-login'
          id='username-input'
        />
        <h4>
          Please enter your secret ingredient <PiCookingPotBold />
        </h4>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={event => handleInputChange(event, 'password')}
          placeholder='Password'
          required
          className='input-text-login'
          id='password-input'
        />
        <div className='show-password-login'>
          <input
            type='checkbox'
            id='showPasswordToggle'
            checked={showPassword}
            onChange={togglePasswordVisibility}
          />
          <label htmlFor='showPasswordToggle'>Show Password</label>
        </div>
        <button type='submit' className='user-login-button'>
          TO THE KITCHEN <IoMdArrowRoundForward />
        </button>
      </form>
      {err && <p className='error-message-login'>{err}</p>}
      <Link to='/signup' className='signup-link'>
        Not a guru yet? Sign up here.
      </Link>
    </div>
  );
};

export default Login;
