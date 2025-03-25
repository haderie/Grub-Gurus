import useNewPost from '../../../hooks/useNewPost';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import TextArea from '../baseComponents/textarea';
import './index.css';

const NewPost = () => {
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
    createPost,
    setVideoUrl,
    searchTerm,
    setSearchTerm,
    videoResults,
    setVideoResults,
    searchYouTube,
    loading,
    likes,
    setLikes,
    saves,
    setSaves,
    postText,
    setPostText,
  } = useNewPost();

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
        hint={'Limit title to 100 characters or less.'}
        id={'formTitleInput'}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <TextArea
        title={'Recipe Description'}
        hint={'Add basic description of recipe.'}
        id={'formTextInput'}
        val={description}
        setState={setDescription}
        err={textErr}
      />

      <Input
        title={'Attach Video (Optional)'}
        hint={'Search for a YouTube video.'}
        id={'videoSearchInput'}
        val={searchTerm}
        setState={setSearchTerm}
        mandatory={false}
      />
      <button type='button' onClick={searchYouTube} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
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
        hint={'Add keywords separated by whitespace and comma, e.g. sugar , water.'}
        id={'formTextInput'}
        val={ingredientNames}
        setState={setIngredientNames}
        err={textErr}
      />

      <TextArea
        title={'Recipe Instructions'}
        hint={'Add instructions for the recipe.'}
        id={'formTextInput'}
        val={instructions}
        setState={setInstructions}
        err={textErr}
      />
      <div className='input_title'>{'Cook Time*'}</div>
      {<div className='input_hint'>{'Add cook time in minutes.'}</div>}
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

      <TextArea
        title={'Post Text (Optional)'}
        hint={'Add a caption for your post!'}
        id={'formTextInput'}
        val={postText}
        setState={setPostText}
        err={textErr}
        mandatory={false}
      />

      <div className='btn_indicator_container'>
        <button
          className='form_postBtn'
          onClick={() => {
            createPost();
          }}>
          Create Post
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewPost;
