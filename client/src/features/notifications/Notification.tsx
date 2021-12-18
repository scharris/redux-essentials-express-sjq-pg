import { formatDistanceToNow, parseISO } from 'date-fns';
import classnames from 'classnames';
import { Notification as NotificationDTO } from '../../data-transfer';

type Props = NotificationDTO & { userName: string | undefined };

export default function Notification(props: Props): JSX.Element
{
  const date = parseISO(props.date);
  const timeAgo = formatDistanceToNow(date);
  const userName = props.userName || 'Unknown User';

  const notificationClassname = classnames('notification', { new: props.isNew, });

  return (
    <div key={props.id} className={notificationClassname}>
      <div>
        <b>{userName}</b> {props.message}
      </div>
      <div title={props.date}>
        <i>{timeAgo} ago</i>
      </div>
    </div>
  );
}
