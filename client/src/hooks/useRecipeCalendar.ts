import { useState } from 'react';
import moment from 'moment';
import { RecipePost, RecipeEvent } from '../types/types';

const useRecipeCalendar = () => {
  const [events, setEvents] = useState<RecipeEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipePost | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [recipe, setRecipe] = useState<RecipePost>({
    title: '',
    ingredients: [],
    instructions: '',
    cookTime: 0,
  });

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setShowForm(true);
  };

  const handleAddRecipe = () => {
    if (selectedDate) {
      const newEvent: RecipeEvent = {
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cookTime: recipe.cookTime,
        start: selectedDate,
        end: moment(selectedDate).add(1, 'hour').toDate(), // Default 1-hour duration
      };
      setEvents([...events, newEvent]);
      setShowForm(false);

      setRecipe({
        title: '',
        ingredients: [],
        instructions: '',
        cookTime: 0,
      });
    }
  };

  return {
    events,
    recipe,
    selectedDate,
    selectedRecipe,
    showForm,
    setSelectedRecipe,
    handleSelectSlot,
    handleAddRecipe,
    setShowForm,
    setRecipe,
  };
};
export default useRecipeCalendar;
