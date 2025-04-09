import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateHyperlink } from '../tool';
import useUserContext from './useUserContext';
import { Recipe, YouTubeVideo } from '../types/types';
import { addRecipe, getRecipesByUsername } from '../services/recipeService';
import { updateCertifiedStatus } from '../services/userService';

const NUM_RECIPES_FOR_CERTIFICATION = 5;

/**
 * Custom hook to handle recipe submission and form validation
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
  const [videoUrl, setVideoUrl] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search input
  const [videoResults, setVideoResults] = useState<YouTubeVideo[]>([]); // Store video search results
  const [loading, setLoading] = useState<boolean>(false);

  const [videoUrlErr, setVideoUrlErr] = useState<string>('');
  const [searchError, setSearchError] = useState<string>(''); // Error state for s

  const [titleErr, setTitleErr] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const [tagErr, setTagErr] = useState<string>('');

  /**
   * Validates if the provided URL is a YouTube video URL.
   * @param {string} url - The URL to validate.
   * @returns {boolean} - Returns true if it's a valid YouTube URL, otherwise false.
   */
  const validateYouTubeURL = (url: string) => {
    const regex =
      /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|e\/|watch\?v%3D)[\w-]+(&[^\s]*)?$/;
    return regex.test(url);
  };

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

    if (videoUrl && !validateYouTubeURL(videoUrl)) {
      setVideoUrlErr('Please provide a valid YouTube URL');
      isValid = false;
    } else {
      setVideoUrlErr('');
    }

    return isValid;
  };

  /**
   * Search YouTube for videos based on the search term.
   */
  const searchYouTube = useCallback(async () => {
    if (!searchTerm) return;
    setLoading(true);
    setSearchError('');

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 10,
          q: searchTerm,
          key: 'AIzaSyADiL5NSZ4JHnw0dGjhk1ajfzjyl1CI3PQ',
        },
      });
      setVideoResults(response.data.items);
      setLoading(false);
    } catch (err) {
      setSearchError('Error fetching YouTube videos. Please try again.');
      setLoading(false);
    }
  }, [searchTerm]);

  /**
   * Selects a video and saves the video URL.
   * @param {string} videoId - The YouTube video ID.
   */
  const selectVideo = (videoId: string) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    setVideoUrl(url);
    setVideoResults([]); // Clear results after selection
  };

  /**
   * Function to post a recipe to the server.
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
      video: videoUrl,
      addedToCalendar: false,
    };

    const res = await addRecipe(recipe);
    const recipes = await getRecipesByUsername(user.username);
    if (recipes.length > NUM_RECIPES_FOR_CERTIFICATION) {
      updateCertifiedStatus(user.username);
    }

    if (res && res._id) {
      navigate(`/user/${user.username}`);
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
    videoUrl,
    setVideoUrl,
    videoUrlErr,
    searchTerm,
    setSearchTerm,
    videoResults,
    setVideoResults,
    searchError,
    searchYouTube,
    selectVideo,
    loading,
  };
};

export default useNewRecipe;
