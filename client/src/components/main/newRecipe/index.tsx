import useNewRecipe from '../../../hooks/useNewRecipe';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import TextArea from '../baseComponents/textarea';
import './index.css';

/**
 * NewRecipe component allows users to submit a new recipe.
 */
const NewRecipe = () => {
  const {
    title,
    setTitle,
    description,
    instructions,
    ingredientNames,
    setDescription,
    setInstructions,
    setIngredientNames,
    tagNames,
    setTagNames,
    cookTime,
    setCookTime,
    titleErr,
    textErr,
    tagErr,
    postRecipe,
    setVideoUrl,
    searchTerm,
    setSearchTerm,
    videoResults,
    searchYouTube,
    loading,
    setVideoResults,
  } = useNewRecipe();

  const predefinedTags = [
    'DR-Gluten-free',
    'DR-Vegetarian',
    'DR-Vegan',
    'DR-Halal',
    'MT-Breakfast',
    'MT-Lunch',
    'MT-Dinner',
    'MT-Snacks',
    'SL-Beginner',
    'SL-Intermediate',
    'SL-Advanced',
  ];

  return (
    <Form>
      <Input
        title={'Recipe Title'}
        hint={'Limit title to 100 characters or less'}
        id={'formTitleInput'}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <TextArea
        title={'Recipe description'}
        hint={'Add basic description of recipe'}
        id={'formTextInput'}
        val={description}
        setState={setDescription}
        err={textErr}
      />

      <Input
        title={'Attach Video (Optional)'}
        hint={'Search for a YouTube video'}
        id={'videoSearchInput'}
        val={searchTerm}
        setState={setSearchTerm}
        mandatory={false}
      />
      <button type='button' onClick={searchYouTube} disabled={loading}>
        {loading ? 'SEARCHING...' : 'Search'}
      </button>

      {videoResults.length > 0 && (
        <div className='video-results'>
          {videoResults.map(video => (
            <div key={video.id.videoId} className='video-item'>
              <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
              <p>{video.snippet.title}</p>
              <button
                onClick={() => {
                  setSearchTerm(`https://www.youtube.com/watch?v=${video.id.videoId}`); // Set the video URL
                  setVideoUrl(`https://www.youtube.com/watch?v=${video.id.videoId}`);
                  setVideoResults([]); // Clear the video results after selection
                }}>
                Select Video
              </button>
            </div>
          ))}
        </div>
      )}

      <TextArea
        title={'Recipe Ingredients'}
        hint={'Add keywords separated by whitespace and comma, e.g. hi , bye'}
        id={'formTextInput'}
        val={ingredientNames}
        setState={setIngredientNames}
        err={textErr}
      />

      <TextArea
        title={'Recipe Instructions'}
        hint={'Add instructions for the recipe'}
        id={'formTextInput'}
        val={instructions}
        setState={setInstructions}
        err={textErr}
      />
      <div className='input_title'>{'Cook time*'}</div>
      {<div className='input_hint'>{'Add cook time number'}</div>}
      <input
        type='number'
        title='Recipe CookTime'
        id={'formTextInput'}
        className='input_input'
        value={cookTime === 0 ? '' : cookTime}
        onChange={e => setCookTime(e.target.value ? Number(e.target.value) : 0)}
      />
      {textErr && <div className='input_error'>{textErr}</div>}

      <div className='tag-container'>
        <Input
          title={'Tags'}
          hint={'Add keywords separated by whitespace'}
          id={'formTagInput'}
          val={tagNames}
          setState={setTagNames}
          err={tagErr}
        />

        {/* Show predefined tags as suggestions */}
        {predefinedTags.length > 0 && (
          <ul className='tag-suggestions'>
            {predefinedTags.map(tag => (
              <div key={tag} className='tag-item'>
                <label>
                  <input
                    type='checkbox'
                    checked={tagNames.includes(tag)}
                    onChange={() => {
                      setTagNames(prev =>
                        prev.includes(tag) ? prev.replace(` ${tag}`, '') : `${prev} ${tag}`,
                      );
                    }}
                  />
                  {tag}
                </label>
              </div>
            ))}
          </ul>
        )}
      </div>

      <div className='btn_indicator_container'>
        <button
          className='form_postBtn'
          onClick={() => {
            postRecipe();
          }}>
          Post Recipe
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewRecipe;
