import { useGetPostsWithContextQuery, getSortedPosts } from '../../app/api';
import PostExcerpt from './PostExcerpt';

export default function PostsList(): JSX.Element
{
  const { posts, isFetching, isSuccess, isError, error } =
    useGetPostsWithContextQuery(undefined, {
      selectFromResult: res =>
        res.data ? { posts: getSortedPosts(res.data.postsData), ...res }
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
