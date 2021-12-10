import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/state/store';
import {
  doGet,
  doPostReturningJson,
  doPut,
  postReactionUrl,
  postsUrl,
  postUrl
} from '../../app/server-api';
import {
  Post,
  CreatedPostData,
  UpdatedPostData,
  NewPostData,
  noReactions,
  NewReactionData,
} from '../../data-transfer';

type PostsLoadingState = { status: string; error: string | null };
const initialLoadingState: PostsLoadingState = { status: 'idle', error: null };

const entityAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = entityAdapter.getInitialState(initialLoadingState);

export const fetchPosts = createAsyncThunk('posts/fetch', async () => {
  return await doGet<Post[]>(postsUrl());
});

export const addNewPost = createAsyncThunk('posts/add', async (postData: NewPostData) => {
  const createdPostData = await doPostReturningJson(postsUrl(), postData) as CreatedPostData;
  return { ...createdPostData, comments: [], reactions: noReactions } as Post;
});

export const updatePost = createAsyncThunk('posts/update', async (post: Post) => {
  const updatedContent : UpdatedPostData = { title: post.title, content: post.content };
  await doPut(postUrl(post.id), updatedContent);
  return { id: post.id, changes: updatedContent };
});

export const addPostReaction = createAsyncThunk('posts/reaction', async (r: NewReactionData, api) => {
  const { added } = await doPostReturningJson(postReactionUrl(r.postId), r);
  const state = api.getState() as RootState;
  const post = state.posts.entities[r.postId] as Post | undefined;
  console.assert(post, `addPostReaction: Post ${r.postId} was not found in the store.`);
  const changes = !post || !added ? {} : {
    reactions: {
      ...post.reactions,
      [r.reaction]: post.reactions[r.reaction] + 1
    }
  };
  return { id: r.postId, changes };
});

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      entityAdapter.setAll(state, action.payload);
    },
  },
  extraReducers: {
    [fetchPosts.pending.type]: (state) => {
      state.status = 'loading';
    },
    [fetchPosts.fulfilled.type]: (state, action) => {
      state.status = 'succeeded';
      entityAdapter.upsertMany(state, action.payload);
    },
    [fetchPosts.rejected.type]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [addNewPost.fulfilled.type]: (state, action) => entityAdapter.addOne(state, action),
    [updatePost.fulfilled.type]: (state, action) => entityAdapter.updateOne(state, action),
    [addPostReaction.fulfilled.type]: entityAdapter.updateOne,
  },
});

export default postSlice.reducer;

export const { setPosts } = postSlice.actions;

// Selectors

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = entityAdapter.getSelectors<any>((state: RootState) => state.posts);

// memoizing selector
// https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc-selectoroptions
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state: RootState, userId: string) => userId], // input selectors for memoization
  (posts, userId) => posts.filter((post) => post.user === userId) // result selector
);