import { Link, RouteComponentProps } from 'react-router-dom';
import { useTypedSelector } from '../../app/store';
import { getSortedPosts, useGetPostsQuery } from '../posts/api';
import { selectUserById } from './api';

type Props = RouteComponentProps<{ userId: string }>;

export default function UserPage({ match }: Props): JSX.Element
{
  const { userId } = match.params;

  const user = useTypedSelector(selectUserById(userId));
  const query = useGetPostsQuery(undefined, {
    selectFromResult: res =>
      res.data ? { posts: getSortedPosts(res.data).filter((p) => p.user === userId), ...res }
               : { posts: [], ...res }
  });

  if (!user)
    return <span>User not found.</span>
  else if (query.isError)
    return query.error ? <div>{query.error.toString()}</div> : <div>Unknown error</div>
  else if (query.isFetching)
    return <span>Loading...</span>;
  else if (query.isSuccess)
    return (
      <section>
        <h2>{user.name}</h2>
        <ul>
          {query.posts.map(post =>
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          )}
        </ul>
      </section>
    );
  else
  {
    console.warn('Unrecognized query state in user page: ', query);
    return <span></span>
  }
};
