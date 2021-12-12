import { createAsyncThunk, createEntityAdapter, createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/state/store';
import { doGet, usersUrl } from '../../app/server-api';
import { User } from '../../data-transfer';

// Add some "extra" state besides the user entities managed by the EntityAdapter.
type CurrentUserState = { currentUserId: string | null };
const initialCurrentUserState: CurrentUserState = { currentUserId: null };

const entityAdapter = createEntityAdapter<User>();

const initialState = entityAdapter.getInitialState(initialCurrentUserState);

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  return doGet<User[]>(usersUrl());
});

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      const users = action.payload;
      entityAdapter.setAll(state, users);
      // Current user is just assigned to first user in the array - do not use in production ;)
      state.currentUserId = users.length > 0 ? users[0].id : null;
    },
  },
  extraReducers: reducerBuilder =>
    reducerBuilder
    .addCase(fetchUsers.fulfilled, (state, action) => {
      const users: User[] = action.payload;
      entityAdapter.setAll(state, users);
      // Current user is just assigned to first user in the array - do not use in production ;)
      state.currentUserId = users.length > 0 ? users[0].id : null;
    })
});

export const { setUsers } = usersSlice.actions;

// Selectors

const entitySelectors = entityAdapter.getSelectors<RootState>((state: RootState) => state.users);
export const { selectAll: selectAllUsers } = entitySelectors;
export const selectUserById = (id: EntityId) => (state: RootState) => entitySelectors.selectById(state, id);

export const selectCurrentUserId = (state: RootState) => state.users.currentUserId;
export function selectCurrentUser(state: RootState): User | null
{
  const currentUserId = state.users.currentUserId;
  return (currentUserId && selectUserById(currentUserId)(state)) || null;
}

// Reducer

export default usersSlice.reducer;
