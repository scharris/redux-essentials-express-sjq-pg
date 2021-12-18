import { Link } from 'react-router-dom';
import {
  selectNotificationsData,
  api as notifsApi
} from '../features/notifications/api';
import { useAppDispatch, useTypedSelector } from './store';

export default function Navbar(): JSX.Element
{
  const notifs = useTypedSelector(selectNotificationsData);

  const dispatch = useAppDispatch();

  const fetchNewNotifications = () => {
    const todayStart = new Date();
    todayStart.setHours(0);
    dispatch(notifsApi.endpoints.getNotificationsSince.initiate(todayStart.toISOString()));
  };

  const numUnread = Object.values(notifs.entities).reduce((c, n) => n && !n.read ? c+1 : c, 0);
  const unreadBadge = numUnread !== 0 ? <span className="badge">{numUnread}</span> : null;

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>
        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">Notifications {unreadBadge}</Link>
          </div>
          <button className="button" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  );
};
