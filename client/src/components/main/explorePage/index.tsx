import React, { useEffect } from 'react';
import './index.css';
import { useLocation } from 'react-router-dom';
import useExplorePage from '../../../hooks/useExplorePage';
import CreatePostButton from '../createPostButton';
import PostCard from '../postCard';

/**
 * Represents the ExplorePage component which displays public posts
 * and provides functionality to interact with the posts and create new posts.
 */
const ExplorePage = () => {
  const { qlist } = useExplorePage();
  const location = useLocation();

  useEffect(() => {
    // Get post ID from URL
    const params = new URLSearchParams(location.search);
    const postId = params.get('post');

    if (postId) {
      // Scroll to the post with this ID
      const postElement = document.getElementById(postId);
      if (postElement) {
        postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [location, qlist]);

  return (
    <>
      <div className='space_between right_padding'>
        <div className='bold_title'>All Posts</div>
        <CreatePostButton />
      </div>
      <div id='post_list' className='post_list'>
        {qlist.map(post =>
          post ? (
            <div key={String(post._id)} id={String(post._id)} className='post-item'>
              <PostCard post={post} />
            </div>
          ) : null,
        )}
      </div>
    </>
  );
};

export default ExplorePage;
