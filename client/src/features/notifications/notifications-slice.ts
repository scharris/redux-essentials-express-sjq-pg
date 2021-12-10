import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/state/store';
import { doGet, notificationsAfterUrl } from '../../app/server-api';
import { Notification } from '../../data-transfer';

const entityAdapter = createEntityAdapter<Notification>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState() as RootState);
    const latestTimestamp = allNotifications[0]?.date;
    return doGet<Notification[]>(notificationsAfterUrl(latestTimestamp));
  }
);

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
  extraReducers: {
    'notifications/fetchNotifications/fulfilled': (state, action: PayloadAction<Notification[]>) => {
      Object.values(state.entities).forEach((notification) => {
        // Any notifications we've read are no longer new
        notification && (notification.isNew = !notification.read);
      });
      entityAdapter.upsertMany(state, action.payload);
    },
  },
});

export const { setNotifications, allNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;

// Selectors
export const { selectAll: selectAllNotifications } =
  entityAdapter.getSelectors<RootState>((state) => state.notifications);
