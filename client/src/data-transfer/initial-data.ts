import { Post } from './post';
import { User } from './user';
import { Notification } from './notification';

export interface InitialData
{
  posts: Post[],
  users: User[],
  notifications: Notification[],
}
