import React, { useEffect } from 'react';
import { useAppDispatch, useTypedSelector } from '../../app/state/store';
import { fetchPosts, selectPostIds } from './posts-slice';
import PostExcerpt from './PostExcerpt';

export const PostsList = () => {
  const orderedPostIds = useTypedSelector(selectPostIds);
  const postsLoadingStatus = useTypedSelector((state) => state.posts.status);
  const appDataLoadingStatus = useTypedSelector((state) => state.loadingStatus.status);
  const error = useTypedSelector((state) => state.posts.error);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (postsLoadingStatus === 'idle' && appDataLoadingStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postsLoadingStatus, dispatch]);

  const content = postsLoadingStatus === 'loading' ? <div className="loader">Loading...</div>
    : orderedPostIds.map((postId) => <PostExcerpt key={postId} postId={postId} />);

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {error}
      {content}
    </section>
  );
};
