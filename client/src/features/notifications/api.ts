import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { api as appApi } from '../../app/api';
import { RootState } from '../../app/store';
import { Notification } from '../../data-transfer';
import { sortedEntities } from '../../util/entities';

type NotificationsData = EntityState<Notification>;

const entityAdapter = createEntityAdapter<Notification>({ sortComparer });

const initialData: NotificationsData = entityAdapter.getInitialState();

type Timestamp = string;

export const api = appApi.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query<NotificationsData, void>({
      query: () => '/notifications',
      transformResponse: (notifs: Notification[]) => entityAdapter.setAll(initialData, notifs)
    }),
    getNotificationsSince: builder.query<Notification[], Timestamp>({
      query: timestamp => `/notifications?since=${timestamp}`,
      async onQueryStarted(_ts, mutApi)
      {
        const { data: notifs } = await mutApi.queryFulfilled;
        // Server side is not implemented to respect the "since" query param, so we just add a bogus
        // notification as an example here, to show how to merge into the above query's results.
        const newNotifs = notifs.slice(notifs.length-2).concat([
          { id: (+(new Date())).toString(), date: '2021-12-15T08:05:03+0', message: 'hello!', user: '1' }
        ]);
        mutApi.dispatch(api.util.updateQueryData('getNotifications', undefined, notifsData => {
          entityAdapter.upsertMany(notifsData, newNotifs);
        }));
      }
    }),
  })
});

const selectNotificationsResult = api.endpoints.getNotifications.select();
export const selectNotificationsData = (state: RootState) => selectNotificationsResult(state)?.data ?? initialData;

const entitySelectors = entityAdapter.getSelectors((state: RootState) => selectNotificationsData(state));
export const selectAllNotifications = entitySelectors.selectAll;

export const getSortedNotifications = (data: NotificationsData) => sortedEntities(data, sortComparer);

export const { useGetNotificationsQuery, useGetNotificationsSinceQuery } = api;

function sortComparer(n1: Notification, n2: Notification) { return n2.date.localeCompare(n1.date); }
