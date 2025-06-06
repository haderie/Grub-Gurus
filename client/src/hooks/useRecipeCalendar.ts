import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Recipe, RecipeCalendarEvent, YouTubeVideo } from '../types/types';
import { addCalendarRecipe, getRecipesByUsername } from '../services/recipeService';

import useUserContext from './useUserContext';

/**
 * Custom hook to manage the recipe calendar for the user.
 *
 * This hook provides functionality to:
 * - Manage and display calendar events for recipes added to the user's calendar.
 * - Handle the selection of a date, time, and color for calendar events.
 * - Add new recipes to the calendar with the specified details (title, ingredients, time, etc.).
 * - Search and display video results related to recipes.
 */
const useRecipeCalendar = () => {
  const { user } = useUserContext();

  const [events, setEvents] = useState<RecipeCalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('12:00'); // Default to 12:00 PM
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeCalendarEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search input
  const [videoResults, setVideoResults] = useState<YouTubeVideo[]>([]); // Store video search results
  const [loading, setLoading] = useState<boolean>(false);

  const [videoUrlErr, setVideoUrlErr] = useState<string>('');
  const [searchError, setSearchError] = useState<string>(''); // Error state for s
  const [selectedColor, setSelectedColor] = useState<string>('#388E3C');

  const [recipeState, setRecipeState] = useState<Recipe>({
    user: user.username,
    title: '',
    ingredients: [],
    instructions: '',
    cookTime: 0,
    privacyPublic: true,
    description: '',
    tags: [],
    addedToCalendar: true,
  });

  useEffect(() => {
    if (user.username) {
      const fetchRecipes = async () => {
        try {
          const res = await getRecipesByUsername(user.username);
          // console.log(res);
          const fetchedRecipes: RecipeCalendarEvent[] = res
            .filter((recipe: RecipeCalendarEvent) => recipe.addedToCalendar)
            .map((recipe: RecipeCalendarEvent) => ({
              ...recipe,
              start: new Date(recipe.start), // Ensure correct date format
              end: new Date(recipe.end),
            }));
          setEvents(fetchedRecipes);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error fetching recipes:', error);
        }
      };
      fetchRecipes();
    }
  }, [user.username]); // Fetch recipes when userId changes

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setSelectedTime('12:00');
    setShowForm(true);
  };

  const handleAddRecipe = async () => {
    if (selectedDate) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const eventStart = moment(selectedDate).set({ hour: hours, minute: minutes }).toDate();
      const eventEnd = moment(eventStart)
        .add(recipeState.cookTime || 60, 'minutes')
        .toDate(); // Default to 1 hour duration

      const newRecipe = {
        user,
        title: recipeState.title,
        ingredients: recipeState.ingredients,
        instructions: recipeState.instructions,
        cookTime: recipeState.cookTime,
        privacyPublic: true,
        description: '',
        tags: [],
        video: videoUrl,
        addedToCalendar: recipeState.addedToCalendar,
        start: eventStart,
        end: eventEnd,
        color: selectedColor,
      };

      try {
        const savedRecipe = await addCalendarRecipe(newRecipe);

        if (!savedRecipe._id) {
          throw new Error('Recipe did not receive an _id');
        }

        const newEvent: RecipeCalendarEvent = {
          ...savedRecipe,
          addedToCalendar: true,
          start: eventStart,
          end: eventEnd,
          color: selectedColor,
        };
        setEvents(prevEvents => [...prevEvents, newEvent]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Error adding recipe: ${error}`);
      }
      setShowForm(false);

      setRecipeState({
        user: user.username,
        title: '',
        ingredients: [],
        instructions: '',
        cookTime: 0,
        privacyPublic: true,
        description: '',
        tags: [],
        addedToCalendar: true,
      });
      setSelectedTime('12:00');
    }
  };

  const handleEventClick = (event: RecipeCalendarEvent) => {
    setSelectedRecipe(event);
  };

  const closeRecipeCard = () => {
    setSelectedRecipe(null);
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
      setVideoUrlErr('Could not fetch video');
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

  return {
    events,
    recipeState,
    selectedDate,
    selectedRecipe,
    showForm,
    selectedTime,
    selectedColor,
    setSelectedRecipe,
    handleSelectSlot,
    handleAddRecipe,
    setShowForm,
    setRecipeState,
    setSelectedTime,
    handleEventClick,
    closeRecipeCard,
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
    setEvents,
    setSelectedColor,
  };
};
export default useRecipeCalendar;
