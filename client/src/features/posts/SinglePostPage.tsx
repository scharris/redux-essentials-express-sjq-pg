import { RouteComponentProps } from 'react-router-dom';
import { useGetPostQuery } from '../../app/api';
import TimeAgo from './TimeAgo';
import PostAuthor from './PostAuthor';

type Props = RouteComponentProps<{ postId: string }>;

export default function SinglePostPage({ match }: Props): JSX.Element
{
  const { postId } = match.params;

  const { data: post, isFetching, isError, isSuccess } = useGetPostQuery(postId);

  return (
    isFetching ? <span>Loading...</span>
    : isError ? <span>Loading failed due to error.</span>
    : isSuccess && post ?
      <section>
        <article className="post">
          <h2>{post.title}</h2>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
          <p className="post-content">{post.content}</p>
        </article>
      </section>
    : <section><h2>Post not found!</h2></section>
  );
};
