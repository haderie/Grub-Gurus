import { useEffect, useState } from 'react';
import moment from 'moment';
import { Recipe, RecipeCalendarEvent } from '../types/types';
import { addRecipe, getRecipesByUsername } from '../services/recipeService';
import useUserContext from './useUserContext';

const useRecipeCalendar = () => {
  const { user } = useUserContext();

  const [events, setEvents] = useState<RecipeCalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('12:00'); // Default to 12:00 PM
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeCalendarEvent | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [recipeState, setRecipeState] = useState<Recipe>({
    user: user.username,
    title: '',
    ingredients: [],
    instructions: '',
    cookTime: 0,
    privacyPublic: true,
    description: '',
    tags: [],
    numOfLikes: 0,
    views: [],
  });

  useEffect(() => {
    if (user.username) {
      const fetchRecipes = async () => {
        try {
          const res = await getRecipesByUsername(user.username);
          // console.log(res);
          const fetchedRecipes: RecipeCalendarEvent[] = res.map((recipe: RecipeCalendarEvent) => ({
            ...recipe,
            start: recipe.start, // Ensure correct date format
            end: recipe.end,
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
        numOfLikes: 0,
        views: [],
      };

      try {
        const savedRecipe = await addRecipe(newRecipe);

        if (!savedRecipe._id) {
          throw new Error('Recipe did not receive an _id');
        }

        const newEvent: RecipeCalendarEvent = {
          ...savedRecipe,
          start: eventStart,
          end: eventEnd,
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
        numOfLikes: 0,
        views: [],
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

  return {
    events,
    recipeState,
    selectedDate,
    selectedRecipe,
    showForm,
    selectedTime,
    setSelectedRecipe,
    handleSelectSlot,
    handleAddRecipe,
    setShowForm,
    setRecipeState,
    setSelectedTime,
    handleEventClick,
    closeRecipeCard,
  };
};
export default useRecipeCalendar;
