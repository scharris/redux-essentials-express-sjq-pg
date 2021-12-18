import { getSortedNotifications, useGetNotificationsQuery } from './api';
import { useTypedSelector } from '../../app/store';
import Notification from './Notification';
import { selectUsersData } from '../../app/api';

export default function NotificationsList(): JSX.Element
{
  const users = useTypedSelector(selectUsersData);

  const { notifs, isFetching, isSuccess, isError, error } =
    useGetNotificationsQuery(undefined, {
      selectFromResult: res => ({
        notifs: (res.data ? getSortedNotifications(res.data) : []),
        ...res
      })
    });

    const content =
      isFetching ?
        <span>Loading...</span> :
      isSuccess ?
        notifs.map(n =>
          <Notification key={n.id} {...n} userName={users.entities[n.user]?.name} />
        ) :
      isError ?
        error ? <div>{error.toString()}</div>
              : <div>Unknown error</div>
      : null;

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {content}
    </section>
  );
};
