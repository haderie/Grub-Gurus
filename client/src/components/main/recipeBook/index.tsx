import { useState } from 'react';
import {
  Button,
  // TextField
} from '@mui/material';
import RecipeCard from '../recipeCard/index';
import { PopulatedDatabaseRecipe } from '../../../types/types';
// import useHeader from '../../../hooks/useHeader';
import './index.css';

interface RecipeBookProps {
  recipes: PopulatedDatabaseRecipe[];
}

const RecipeBook = ({ recipes }: RecipeBookProps) => {
  const [selectedRecipe, setSelectedRecipe] = useState<PopulatedDatabaseRecipe | null>(null);
  // const { val, handleInputChange, handleKeyDownRecipe } = useHeader();

  return (
    <>
      <div className='total-recipe-container'>
        {/* Left Sidebar: Recipe Names */}
        <div className='recipe-list'>
          <h2 className=''>Recipes</h2>
          {/* <TextField
            id='searchBarss'
            size='small'
            placeholder='Search recipes...'
            value={val}
            variant='outlined'
            onChange={handleInputChange}
            onKeyDown={handleKeyDownRecipe}
          /> */}
          <div className=''>
            {recipes.map(recipe => (
              <li
                key={recipe._id.toString()}
                className={`recipe-list-card ${selectedRecipe?._id === recipe._id}`}
                onClick={() => setSelectedRecipe(recipe)}>
                <Button className='w-full text-left' onClick={() => setSelectedRecipe(recipe)}>
                  {recipe.title}
                </Button>
              </li>
            ))}
          </div>
        </div>

        {/* Right Section: Recipe Details */}
        <div className='recipe-container'>
          {selectedRecipe ? (
            <RecipeCard recipe={selectedRecipe} />
          ) : (
            <p>Select a recipe to view details.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default RecipeBook;
