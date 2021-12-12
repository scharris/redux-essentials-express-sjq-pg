import React, { useEffect } from 'react';
import { useAppDispatch, useTypedSelector } from '../../app/state/store';
import { fetchPosts, selectPostIds, selectPostsLoadingError, selectPostsLoadingStatus } from './posts-slice';
import PostExcerpt from './PostExcerpt';
import { selectLoadingStatusState } from '../../app/state/loading-status-slice';

export const PostsList = () => {
  const orderedPostIds = useTypedSelector(selectPostIds);
  const postsLoadingStatus = useTypedSelector(selectPostsLoadingStatus);
  const appDataLoadingStatus = useTypedSelector(selectLoadingStatusState);
  const postsLoadingError = useTypedSelector(selectPostsLoadingError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (postsLoadingStatus === 'idle' && appDataLoadingStatus.status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postsLoadingStatus, appDataLoadingStatus, dispatch]);

  const content = postsLoadingStatus === 'loading' ? <div className="loader">Loading...</div>
    : orderedPostIds.map((postId) => <PostExcerpt key={postId} postId={postId} />);

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {postsLoadingError}
      {appDataLoadingStatus.error}
      {content}
    </section>
  );
};
