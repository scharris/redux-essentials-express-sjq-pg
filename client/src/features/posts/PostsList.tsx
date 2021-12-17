import { useGetPostsQuery, getSortedPosts } from './api';
import PostExcerpt from './PostExcerpt';

export default function PostsList(): JSX.Element
{
  const { posts, isFetching, isSuccess, isError, error } =
    useGetPostsQuery(undefined, {
      selectFromResult: res =>
        res.data ? { posts: getSortedPosts(res.data), ...res }
                 : { posts: [], ...res }
    });

  const content =
    isFetching ?
      <span>Loading...</span> :
    isSuccess ?
      posts.map(post => <PostExcerpt key={post.id} post={post} />) :
    isError ?
      error ? <div>{error.toString()}</div>
            : <div>Unknown error</div>
    : null;

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  );
};
