import React from 'react';
import './index.css';
import useExplorePage from '../../../hooks/useExplorePage';
import CreatePostButton from '../createPostButton';
import PostCard from '../postCard';

/**
 * Represents the TagPage component which displays a list of tags
 * and provides functionality to handle tag clicks and ask a new question.
 */
const ExplorePage = () => {
  const { qlist } = useExplorePage();
  return (
    <>
      <div className='space_between right_padding'>
        <div className='bold_title'>All Posts</div>
        <CreatePostButton />
      </div>
      <div id='post_list' className='post_list'>
        {qlist.map(post =>
          post ? (
            <div key={String(post._id)} className='post-item'>
              <PostCard post={post} />
            </div>
          ) : null,
        )}
      </div>
    </>
  );
};

export default ExplorePage;
