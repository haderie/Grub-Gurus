import React from 'react';
import ReactPlayer from 'react-player';
import './index.css';
import { handleHyperlink } from '../../../../tool';

/**
 * Interface representing the props for the QuestionBody component.
 *
 * - views - The number of views the question has received.
 * - text - The content of the question, which may contain hyperlinks.
 * - askby - The username of the user who asked the question.
 * - meta - Additional metadata related to the question, such as the date and time it was asked.
 */
interface QuestionBodyProps {
  views: number;
  text: string;
  askby: string;
  meta: string;
  youtubeVideoUrl?: string;
}

/**
 * QuestionBody component that displays the body of a question.
 * It includes the number of views, the question content (with hyperlink handling),
 * the username of the author, and additional metadata.
 *
 * @param views The number of views the question has received.
 * @param text The content of the question.
 * @param askby The username of the question's author.
 * @param meta Additional metadata related to the question.
 */
const QuestionBody = ({ views, text, askby, meta, youtubeVideoUrl }: QuestionBodyProps) => (
  <div id='questionBody' className='questionBody right_padding'>
    <div className='bold_title answer_question_view'>{views} views</div>
    <div className='answer_question_text'>{handleHyperlink(text)}</div>
    {youtubeVideoUrl && (
      <ReactPlayer
        url={youtubeVideoUrl}
        width='50%'
        height='auto'
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          border: '2px solid red', // Temporary border to see if it's being rendered
        }}
      />
    )}
    <div className='answer_question_right'>
      <div className='question_author'>{askby}</div>
      <div className='answer_question_meta'>asked {meta}</div>
    </div>
  </div>
);

export default QuestionBody;
