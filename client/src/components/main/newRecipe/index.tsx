import useNewRecipe from '../../../hooks/useNewRecipe';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import TextArea from '../baseComponents/textarea';

const NewRecipe = () => {
  const {
    title,
    setTitle,
    text,
    setText,
    tagNames,
    setTagNames,
    titleErr,
    textErr,
    tagErr,
    postRecipe,
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
        hint={'Add basic information'}
        id={'formTextInput'}
        val={text}
        setState={setText}
        err={textErr}
      />

      <TextArea
        title={'Recipe Ingredients'}
        hint={'Add basic information'}
        id={'formTextInput'}
        val={text}
        setState={setText}
        err={textErr}
      />

      <TextArea
        title={'Recipe Instructions'}
        hint={'Add basic information'}
        id={'formTextInput'}
        val={text}
        setState={setText}
        err={textErr}
      />

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
