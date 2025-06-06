import { ChangeEvent, useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoginContext from './useLoginContext';
import useUserContext from './useUserContext';

/**
 * Custom hook to manage the state and logic for a header input field.
 * It supports handling input changes, executing a search on 'Enter' key press,
 * and managing user sign-out functionality.
 *
 * @returns {Object} An object containing:
 *   - val: The current value of the input field.
 *   - setVal: Function to update the input field value.
 *   - handleInputChange: Function to handle changes in the input field.
 *   - handleKeyDown: Function to handle 'Enter' key press and trigger a search.
 *   - handleSignOut: Function to handle user sign-out and navigation to the landing page.
 */
const useHeader = () => {
  const navigate = useNavigate();
  const { setUser } = useLoginContext();
  const { user: currentUser } = useUserContext();

  const [val, setVal] = useState<string>('');

  /**
   * Updates the state value when the input field value changes.
   *
   * @param e - The input change event.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

  /**
   * Handles the 'Enter' key press event to perform a search action.
   * Constructs a search query and navigates to the search results page.
   *
   * @param e - The keyboard event object.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const searchParams = new URLSearchParams();
      searchParams.set('search', val);

      navigate(`/home?${searchParams.toString()}`);
    }
  };

  /**
   * Handles the 'Enter' key press event to perform a search action for recipe.
   * Constructs a search query and navigates to the search results page.
   *
   * @param e - The keyboard event object.
   */
  const handleKeyDownRecipe = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const searchParams = new URLSearchParams();
      searchParams.set('search', val);

      navigate(`/user/${currentUser.username}/?${searchParams.toString()}`);
    }
  };

  /**
   * Signs the user out by clearing the user context and navigating to the landing page.
   */
  const handleSignOut = () => {
    setUser(null);
    navigate('/');
  };

  return {
    val,
    setVal,
    handleInputChange,
    handleKeyDown,
    handleSignOut,
    handleKeyDownRecipe,
  };
};

export default useHeader;
