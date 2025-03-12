import RecipeCard from '../recipeCard/index';
import { DatabaseRecipe } from '../../../types/types';

const RecipeBook = ({ recipes }: { recipes: DatabaseRecipe[] }) => {
  if (recipes.length === 0) {
    return <p>No recipes available.</p>;
  }

  return (
    <div className='recipe-book'>
      <div className='recipe-list'>
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id.toString()} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeBook;
