import { useState } from 'react';
import moment from 'moment';
import { RecipeCalendarEvent } from '../types/types';

const useRecipeCalendar = () => {
  const [events, setEvents] = useState<RecipeCalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('12:00'); // Default to 12:00 PM
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeCalendarEvent | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [recipe, setRecipe] = useState<RecipeCalendarEvent>({
    title: '',
    ingredients: [],
    instructions: '',
    cookTime: 0,
    start: new Date(),
    end: new Date(),
  });

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setSelectedTime('12:00');
    setShowForm(true);
  };

  const handleAddRecipe = () => {
    if (selectedDate) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const eventStart = moment(selectedDate).set({ hour: hours, minute: minutes }).toDate();
      const eventEnd = moment(eventStart)
        .add(recipe.cookTime || 60, 'minutes')
        .toDate(); // Default to 1 hour duration

      const newEvent: RecipeCalendarEvent = {
        ...recipe,
        start: eventStart,
        end: eventEnd,
      };
      setEvents([...events, newEvent]);
      setShowForm(false);

      setRecipe({
        title: '',
        ingredients: [],
        instructions: '',
        cookTime: 0,
        start: new Date(),
        end: new Date(),
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
    recipe,
    selectedDate,
    selectedRecipe,
    showForm,
    selectedTime,
    setSelectedRecipe,
    handleSelectSlot,
    handleAddRecipe,
    setShowForm,
    setRecipe,
    setSelectedTime,
    handleEventClick,
    closeRecipeCard,
  };
};
export default useRecipeCalendar;
