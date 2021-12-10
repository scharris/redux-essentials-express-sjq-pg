import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import postsReducer from '../../features/posts/posts-slice';
import usersReducer from '../../features/users/users-slice';
import notificationsReducer from '../../features/notifications/notifications-slice';
import loadingStatusReducer from './loading-status-slice';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    loadingStatus: loadingStatusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
