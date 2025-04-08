import { useState } from 'react';
import {
  Button,
  Chip,
  // TextField
} from '@mui/material';
import RecipeCard from '../recipeCard/index';
import { PopulatedDatabaseRecipe } from '../../../types/types';
// import useHeader from '../../../hooks/useHeader';
import './index.css';

/**
 * Interface for the props expected by the RecipeBook component.
 * It expects a list of populated recipes to be passed in as an array.
 *
 * @param recipes An array of PopulatedDatabaseRecipe objects representing the recipes to display in the recipe book.
 */
interface RecipeBookProps {
  recipes: PopulatedDatabaseRecipe[];
}

/**
 * RecipeBook component that displays a collection of recipes.
 * The component allows for selecting a recipe and viewing its details.
 *
 * @param recipes An array of PopulatedDatabaseRecipe objects passed as a prop to render the recipe list.
 * @returns a component that displays a list of recipes in a sidebar, and potentially details of the selected recipe.
 */
const RecipeBook = ({ recipes }: RecipeBookProps) => {
  const [selectedRecipe, setSelectedRecipe] = useState<PopulatedDatabaseRecipe | null>(null);

  return (
    <>
      <div className='total-recipe-container'>
        {/* Left Sidebar: Recipe Names */}
        <div className='recipe-list'>
          <h2 className=''>Recipes</h2>
          <div className=''>
            {recipes.map(recipe => (
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  marginTop: '4px',
                  flexWrap: 'wrap',
                  alignContent: 'center',
                }}
                key={recipe._id.toString()}
                className={`recipe-list-card ${selectedRecipe?._id === recipe._id}`}
                onClick={() => setSelectedRecipe(recipe)}>
                <Button
                  className='w-full text-left'
                  sx={{ color: '#FFF5E4', textAlign: 'left', fontSize: '13px' }}
                  onClick={() => setSelectedRecipe(recipe)}>
                  {recipe.title}
                </Button>
                <div className='text-xs text-gray-300 mt-1'>
                  {recipe.tags?.slice(0, 2).map((tag, index) => (
                    <span key={index} className='mr-1'>
                      <Chip
                        key={String(tag._id)}
                        label={tag.name}
                        color='primary'
                        variant='outlined'
                        sx={{
                          'mt': 2,
                          'color': '#FFF5E4',
                          'font-size': '10px',
                          'borderColor': '#FFF5E4',
                          '&:hover': {
                            backgroundColor: '#FFA725',
                          },
                        }}
                      />
                    </span>
                  ))}
                </div>
              </div>
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
