import './index.css';
import React from 'react';
import Form from '../baseComponents/form';
import TextArea from '../baseComponents/textarea';
import Input from '../baseComponents/input';
import useAnswerForm from '../../../hooks/useAnswerForm';

/**
 * NewAnswerPage component allows users to submit an answer to a specific question.
 */
const NewAnswerPage = () => {
  const {
    text,
    textErr,
    setText,
    postAnswer,
    videoUrl,
    setVideoUrl,
    videoUrlErr,
    searchTerm,
    setSearchTerm,
    videoResults,
    setVideoResults,
    searchError,
    searchYouTube,
    selectVideo,
    loading,
  } = useAnswerForm();

  return (
    <Form>
      <TextArea
        title={'Answer Text'}
        id={'answerTextInput'}
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

      <div className='btn_indicator_container'>
        <button className='form_postBtn' onClick={postAnswer}>
          Post Answer
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewAnswerPage;
