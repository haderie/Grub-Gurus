import React, { useState } from 'react';
import useNewQuestion from '../../../hooks/useNewQuestion';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import TextArea from '../baseComponents/textarea';
import './index.css';

/**
 * NewQuestionPage component allows users to submit a new question with a title,
 * description, tags, and username.
 */
const NewQuestionPage = () => {
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
    postQuestion,
    setVideoUrl,
    searchTerm,
    setSearchTerm,
    videoResults,
    searchYouTube,
    loading,
    setVideoResults,
  } = useNewQuestion();

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
        title={'Question Title'}
        hint={'Limit title to 100 characters or less'}
        id={'formTitleInput'}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <TextArea
        title={'Question Text'}
        hint={'Add details'}
        id={'formTextInput'}
        val={text}
        setState={setText}
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
            postQuestion();
          }}>
          Post Question
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewQuestionPage;
