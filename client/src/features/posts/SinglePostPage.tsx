import React from 'react';
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import { selectPostById } from './posts-slice';
import { RouteComponentProps } from 'react-router-dom';
import { useTypedSelector } from '../../app/state/store';

type Params = { postId: string };

export const SinglePostPage = ({ match }: RouteComponentProps<Params>) => {
  const { postId } = match.params;
  const post = useTypedSelector((state) => selectPostById(state, postId));

  return post ? (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
        <p className="post-content">{post.content}</p>
      </article>
    </section>
  ) : (
    <section>
      <h2>Post not found!</h2>
    </section>
  );
};
