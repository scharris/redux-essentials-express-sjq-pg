import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/state/store';
import { doGet, notificationsAfterUrl } from '../../app/server-api';
import { Notification } from '../../data-transfer';

const entityAdapter = createEntityAdapter<Notification>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, api) => {
  // NOTE: Next code line needs the type ascription - we can't use the store's type to statically
  //       type the notifications here, as this would cause type circularity errors.
  const ntfnsState = (<any>api.getState()).notifications as EntityState<Notification>;
  const latestNtfnId = ntfnsState.ids[0];
  const latestTs = latestNtfnId ? ntfnsState.entities[latestNtfnId]?.date : null;
  return doGet<Notification[]>(notificationsAfterUrl(latestTs));
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: entityAdapter.getInitialState(),
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      entityAdapter.setAll(state, action.payload);
    },
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((notification) => {
        notification && (notification.read = true);
      });
    },
  },
  extraReducers: reducerBuilder =>
    reducerBuilder
    .addCase(fetchNotifications.fulfilled, (state, action) => {
      Object.values(state.entities).forEach(notification => {
        // Any notifications we've read are no longer new
        notification && (notification.isNew = !notification.read);
      });
      entityAdapter.upsertMany(state, action.payload);
    })
});

export const { setNotifications, allNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;

// Selectors
export const { selectAll: selectAllNotifications } =
  entityAdapter.getSelectors<RootState>((state) => state.notifications);
