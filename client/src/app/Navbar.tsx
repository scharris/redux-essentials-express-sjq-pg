import React from 'react';
import { Link } from 'react-router-dom';
import {
  fetchNotifications,
  selectAllNotifications,
} from '../features/notifications/notifications-slice';
import { useAppDispatch, useTypedSelector } from './state/store';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const notifications = useTypedSelector(selectAllNotifications);
  const numUnreadNotifications = notifications.filter((n) => !n.read).length;
  const fetchNewNotifications = () => dispatch(fetchNotifications());

  const unreadNotificationsBadge =
    numUnreadNotifications === 0 ? undefined : <span className="badge">{numUnreadNotifications}</span>;

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">Notifications {unreadNotificationsBadge}</Link>
          </div>
          <button className="button" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  );
};
