import store from './store';
import { doGet, initialDataUrl } from '../server-api';
import { InitialData } from '../../data-transfer';
import { loadingInProgress, loadingSucceeded, loadingFailed } from './loading-status-slice';
import { setPosts } from '../../features/posts/posts-slice';
import { setUsers } from '../../features/users/users-slice';
import { setNotifications } from '../../features/notifications/notifications-slice';

export async function loadAndDispatchInitialData(): Promise<void>
{
  store.dispatch(loadingInProgress());

  try
  {
    const data = await doGet<InitialData>(initialDataUrl());

    store.dispatch(setPosts(data.posts));
    store.dispatch(setUsers(data.users));
    store.dispatch(setNotifications(data.notifications));
    store.dispatch(loadingSucceeded());
  }
  catch (e: any)
  {
    console.error(e);
    store.dispatch(loadingFailed('loading failed due to error'))
  }
}
