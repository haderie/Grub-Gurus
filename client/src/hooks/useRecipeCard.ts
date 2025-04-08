import moment from 'moment';
import { useState } from 'react';
import { PopulatedDatabaseRecipe, RecipeCalendarEvent } from '../types/types';
import { updateRecipeForCalendar } from '../services/recipeService';
import useRecipeCalendar from './useRecipeCalendar';
import useUserContext from './useUserContext';

/**
 * Custom hook to manage adding a recipe to the user's calendar.
 *
 * This hook provides functionality to:
 * - Set and manage the modal state for adding a recipe to the calendar.
 * - Handle the selection of a date, time, and color for the calendar event.
 * - Add the recipe to the calendar by updating the recipe's data and creating a corresponding event.
 *
 * The hook communicates with the `useUserContext` to access the user and `useRecipeCalendar` for managing calendar events.
 * It interacts with the `updateRecipeForCalendar` function to update recipe data with calendar event details.
 */
const useAddRecipeToCalendar = () => {
  const { user } = useUserContext();
  const { setEvents } = useRecipeCalendar();

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('12:00'); // Default to 12:00 PM
  const [selectedColor, setSelectedColor] = useState<string>('#388E3C');

  const addRecipeToCalendar = async (recipe: PopulatedDatabaseRecipe) => {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const eventStart = moment(selectedDate).set({ hour: hours, minute: minutes }).toDate();
    const eventEnd = moment(eventStart)
      .add(recipe.cookTime || 60, 'minutes')
      .toDate();

    const updatedRecipeData = {
      user,
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cookTime: recipe.cookTime,
      privacyPublic: true,
      description: '',
      tags: [],
      addedToCalendar: true,
      start: eventStart,
      end: eventEnd,
      color: selectedColor,
    };

    try {
      const updatedRecipe = await updateRecipeForCalendar(
        recipe._id,
        updatedRecipeData.addedToCalendar,
        updatedRecipeData.start,
        updatedRecipeData.end,
        updatedRecipeData.color,
      );

      if (!updatedRecipe._id) throw new Error('Failed to update recipe.');

      const newEvent: RecipeCalendarEvent = {
        ...updatedRecipe,
        addedToCalendar: true,
        start: eventStart,
        end: eventEnd,
        color: selectedColor,
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error adding recipe: ${error}`);
    }
  };

  const handleConfirm = (recipe: PopulatedDatabaseRecipe) => {
    addRecipeToCalendar(recipe);
    setShowModal(false);
  };

  return {
    showModal,
    selectedDate,
    selectedTime,
    selectedColor,
    setSelectedColor,
    handleConfirm,
    addRecipeToCalendar,
    setShowModal,
    setSelectedDate,
    setSelectedTime,
  };
};

export default useAddRecipeToCalendar;
