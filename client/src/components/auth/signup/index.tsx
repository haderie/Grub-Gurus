import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { TbChefHat } from 'react-icons/tb';
import { PiCookingPotBold } from 'react-icons/pi';
import { IoMdArrowRoundForward } from 'react-icons/io';
import useAuth from '../../../hooks/useAuth';

/**
 * Renders a signup form with username, password, and password confirmation inputs,
 * password visibility toggle, error handling, and a link to the login page.
 */
const Signup = () => {
  const {
    username,
    password,
    passwordConfirmation,
    showPassword,
    err,
    handleSubmit,
    handleInputChange,
    togglePasswordVisibility,
  } = useAuth('signup');

  return (
    <div className='signup-container'>
      <h2>Sign up for Grub Gurus!</h2>
      <form onSubmit={handleSubmit}>
        <h4>
          What should we call you, Chef? <TbChefHat />
        </h4>
        <input
          type='text'
          value={username}
          onChange={event => handleInputChange(event, 'username')}
          placeholder='Username'
          required
          className='input-text-signup'
          id='username-input'
        />
        <h4>
          What is your secret ingredient? <PiCookingPotBold />
        </h4>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={event => handleInputChange(event, 'password')}
          placeholder='Password'
          required
          className='input-text-signup'
          id='password-input'
        />
        <input
          type={showPassword ? 'text' : 'password'}
          value={passwordConfirmation}
          onChange={e => handleInputChange(e, 'confirmPassword')}
          placeholder='Confirm Password'
          required
          className='input-text-signup'
        />
        <div className='show-password-signup'>
          <input
            type='checkbox'
            id='showPasswordToggle'
            checked={showPassword}
            onChange={togglePasswordVisibility}
          />
          <label htmlFor='showPasswordToggle'>Show Password</label>
        </div>
        <button type='submit' className='signup-button'>
          JOIN THE KITCHEN <IoMdArrowRoundForward />
        </button>
      </form>
      {err && <p className='error-message-signup'>{err}</p>}
      <Link to='/' className='login-link'>
        Already a guru? Login here.
      </Link>
    </div>
  );
};

export default Signup;
