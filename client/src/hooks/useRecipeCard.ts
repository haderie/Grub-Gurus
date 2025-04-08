import moment from 'moment';
import { useState } from 'react';
import { PopulatedDatabaseRecipe, RecipeCalendarEvent } from '../types/types';
import { updateRecipeForCalendar } from '../services/recipeService';
import useRecipeCalendar from './useRecipeCalendar';
import useUserContext from './useUserContext';

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
      // const savedRecipe = await addCalendarRecipe(newRecipe);
      // if (!savedRecipe._id) throw new Error('Recipe did not receive an _id');

      // setEvents((prevEvents: RecipeCalendarEvent[]) => [
      //   ...prevEvents,
      //   { ...savedRecipe, start: eventStart, end: eventEnd, color: selectedColor },
      // ]);
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
