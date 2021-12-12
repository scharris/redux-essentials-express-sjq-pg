import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

type LoadingStatusState = { status: Status; error: string | null };

const initialState: LoadingStatusState = { status: 'idle', error: null };

const loadingStatusSlice = createSlice({
  name: 'data-loading',
  initialState,
  reducers: {
    loadingInProgress(state) {
      state.status = 'loading';
      state.error = null;
    },
    loadingSucceeded(state) {
      state.status = 'succeeded';
      state.error = null;
    },
    loadingFailed(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    }
  },
});

export default loadingStatusSlice.reducer;

export const { loadingInProgress, loadingSucceeded, loadingFailed } = loadingStatusSlice.actions;

// Selectors

export function selectLoadingStatusState(state: RootState): LoadingStatusState
{
  return state.loadingStatus;
}
