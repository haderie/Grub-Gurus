import React from 'react';
import { DatabaseRecipe } from '../../../types/types';
import { getMetaData } from '../../../tool';

/**
 * RecipeCard component displays a single recipe with its name, views, and ingredients.
 *
 * @param recipe: The recipe object to display.
 */
const RecipeCard = ({ recipe }: { recipe: DatabaseRecipe }) => (
  <div className='recipe-card'>
    <div className='recipe-header'>
      <h3 className='recipe-name'>{recipe.name}</h3>
      <span className='recipe-views'>{recipe.views} views</span>
    </div>
    <div className='recipe-body'>
      <p className='recipe-ingredients'>Ingredients: {recipe.ingredients.join(', ')}</p>
    </div>
  </div>
);

// do this in recipeHook, also need to create socket for it
// /**
//  * Function to handle views updates from the socket.
//  *
//  * @param question - The updated question object.
//  */
// const handleViewsUpdate = (question: PopulatedDatabaseQuestion) => {
//   setQlist(prevQlist => prevQlist.map(q => (q._id === question._id ? question : q)));
// };

export default RecipeCard;
