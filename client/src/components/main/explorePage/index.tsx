import React from 'react';
import './index.css';
import useExplorePage from '../../../hooks/useExplorePage';
import CreatePostButton from '../createPostButton';
import PostCard from '../postCard';

/**
 * Represents the ExplorePage component which displays public posts
 * and provides functionality to interact with the posts and create new posts.
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
