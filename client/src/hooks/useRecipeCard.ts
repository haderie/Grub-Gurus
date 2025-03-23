import moment from 'moment';
import { useState } from 'react';
import { DatabaseRecipe, RecipeCalendarEvent } from '../types/types';
import { updateRecipeForCalendar } from '../services/recipeService';
import useRecipeCalendar from './useRecipeCalendar';
import useUserContext from './useUserContext';

const useAddRecipeToCalendar = () => {
  const { user } = useUserContext();
  const { setEvents } = useRecipeCalendar();

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today
  const [selectedTime, setSelectedTime] = useState<string>('12:00');
  const [selectedColor, setSelectedColor] = useState<string>('#ff0000');

  const addRecipeToCalendar = async (recipe: DatabaseRecipe) => {
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
      numOfLikes: 0,
      views: [],
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

      setEvents((prevEvents: RecipeCalendarEvent[]) => [
        ...prevEvents,
        { ...updatedRecipe, start: eventStart, end: eventEnd, color: selectedColor },
      ]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error adding recipe: ${error}`);
    }
  };

  const handleConfirm = (recipe: DatabaseRecipe) => {
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
