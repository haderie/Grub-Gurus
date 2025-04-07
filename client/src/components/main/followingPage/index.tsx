import React from 'react';
import './index.css';
import CreatePostButton from '../createPostButton';
import PostCard from '../postCard';
import useFollowingPage from '../../../hooks/useFollowingPage';

/**
 * Represents the FollowingPage component which displays posts from users that
 * you follow and provides functionality to interact with the posts and create new posts.
 */
const FollowingPage = () => {
  const { qlist } = useFollowingPage();

  return (
    <>
      <div className='space_between right_padding'>
        <div className='bold_title'>Following</div>
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

export default FollowingPage;
