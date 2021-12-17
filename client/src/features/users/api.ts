import { createEntityAdapter, EntityState, EntityId } from '@reduxjs/toolkit';
import { api as appApi } from '../../app/api';
import { RootState } from '../../app/store';
import { User } from '../../data-transfer';

type CurrentUserState = { currentUser: User | null };

type UsersData = EntityState<User> & CurrentUserState;

const entityAdapter = createEntityAdapter<User>();

const initialData: UsersData = entityAdapter.getInitialState({ currentUser: null });

export const api = appApi.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query<UsersData, void>({
      query: () => '/users',
      transformResponse: (users: User[]) => {
        const currentUser = users[0] ?? null; // TODO: Set the current user some other way in a real app ;)
        return { ...entityAdapter.setAll(initialData, users), currentUser };
      }
    })
  })
});

export const { useGetUsersQuery } = api;

const selectUsersResult = api.endpoints.getUsers.select();
export const selectUsersData = (state: RootState) => selectUsersResult(state)?.data ?? initialData;

const entitySelectors = entityAdapter.getSelectors((state: RootState) => selectUsersData(state));
export const selectAllUsers = entitySelectors.selectAll;
export const selectUserById = (id: EntityId) => (state: RootState) => entitySelectors.selectById(state, id) ?? null;

export const selectCurrentUser = (state: RootState) => selectUsersData(state)?.currentUser ?? null;
