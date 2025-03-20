import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateHyperlink } from '../tool';
import useUserContext from './useUserContext';
import { Recipe } from '../types/types';
import { addPost } from '../services/postService';

/**
 * Custom hook to handle question submission and form validation
 *
 * @returns title - The current value of the title input.
 * @returns text - The current value of the text input.
 * @returns tagNames - The current value of the tags input.
 * @returns titleErr - Error message for the title field, if any.
 * @returns textErr - Error message for the text field, if any.
 * @returns tagErr - Error message for the tag field, if any.
 * @returns postQuestion - Function to validate the form and submit a new question.
 */
const useNewRecipe = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [ingredientNames, setIngredientNames] = useState<string>('');
  const [tagNames, setTagNames] = useState<string>('');
  const [cookTime, setCookTime] = useState<number>(0);

  const [titleErr, setTitleErr] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const [tagErr, setTagErr] = useState<string>('');

  /**
   * Function to validate the form before submitting the question.
   *
   * @returns boolean - True if the form is valid, false otherwise.
   */
  const validateForm = (): boolean => {
    let isValid = true;

    if (!title) {
      setTitleErr('Title cannot be empty');
      isValid = false;
    } else if (title.length > 100) {
      setTitleErr('Title cannot be more than 100 characters');
      isValid = false;
    } else {
      setTitleErr('');
    }

    if (!description) {
      setTextErr('Question text cannot be empty');
      isValid = false;
    } else if (!validateHyperlink(description)) {
      setTextErr('Invalid hyperlink format.');
      isValid = false;
    } else {
      setTextErr('');
    }

    const tagnames = tagNames.split(' ').filter(tagName => tagName.trim() !== '');
    if (tagnames.length === 0) {
      setTagErr('Should have at least 1 tag');
      isValid = false;
    } else if (tagnames.length > 5) {
      setTagErr('Cannot have more than 5 tags');
      isValid = false;
    } else {
      setTagErr('');
    }

    for (const tagName of tagnames) {
      if (tagName.length > 20) {
        setTagErr('New tag length cannot be more than 20');
        isValid = false;
        break;
      }
    }

    const ingredientnames = ingredientNames
      .split(' , ')
      .filter(ingredientName => ingredientName.trim() !== '');
    if (ingredientnames.length === 0) {
      setTagErr('Should have at least 1 ingredient');
      isValid = false;
    } else {
      setTagErr('');
    }

    return isValid;
  };

  /**
   * Function to post a question to the server.
   *
   * @returns title - The current value of the title input.
   */
  const postRecipe = async () => {
    if (!validateForm()) return;

    const tagnames = tagNames.split(' ').filter(tagName => tagName.trim() !== '');
    const tags = tagnames.map(tagName => ({
      name: tagName,
      description: 'user added tag',
    }));

    const ingredients = ingredientNames
      .split(' , ')
      .filter(ingredientName => ingredientName.trim() !== '');

    const recipe: Recipe = {
      title,
      description,
      tags,
      user,
      privacyPublic: false,
      ingredients,
      instructions,
      cookTime,
      numOfLikes: 0,
      views: [],
      addedToCalendar: false,
    };

    const res = await addPost(recipe);

    if (res && res._id) {
      navigate('/explore');
    }
  };

  return {
    title,
    setTitle,
    description,
    instructions,
    ingredientNames,
    setDescription,
    setInstructions,
    setIngredientNames,
    tagNames,
    setTagNames,
    cookTime,
    setCookTime,
    titleErr,
    textErr,
    tagErr,
    postRecipe,
  };
};

export default useNewRecipe;
