import { Link } from 'react-router-dom';
import { useTypedSelector } from '../../app/store';
import { selectAllUsers } from './api';

export default function UsersList(): JSX.Element
{
  const users = useTypedSelector(selectAllUsers);

  const renderedUsers = users.map((user) => (
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </li>
  ));

  return (
    <section>
      <h2>Users</h2>
      <ul>{renderedUsers}</ul>
    </section>
  );
};
