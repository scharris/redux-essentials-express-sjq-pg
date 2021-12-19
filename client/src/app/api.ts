import { createEntityAdapter, EntityId, EntityState } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { sortedEntities } from '../util/entities';
import {
  CreatedPostData,
  CreatePostData,
  CreateReactionData,
  Post,
  PostsWithContext,
  UpdatePostData,
  User
} from '../data-transfer';
import { RootState } from './store';

type PostsData = EntityState<Post>;
const postsEntityAdapter = createEntityAdapter<Post>({ sortComparer: comparePosts });
function comparePosts(p1: Post, p2: Post) { return p2.date.localeCompare(p1.date); }
const initialPostsData: PostsData = postsEntityAdapter.getInitialState();
type InvalidatedPost = { type: 'Post', id: EntityId };

type UsersData = EntityState<User> & CurrentUserState;
type CurrentUserState = { currentUser: User | null };
const usersEntityAdapter = createEntityAdapter<User>({ sortComparer: compareUsers });
function compareUsers(u1: User, u2: User) { return u1.name.localeCompare(u2.name); }
const initialUsersData: UsersData = usersEntityAdapter.getInitialState({ currentUser: null });

type PostsWithContextData = {
  postsData: PostsData;
  usersData: UsersData;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Post'],
  endpoints: builder => ({
    getPostsWithContext: builder.query<PostsWithContextData, void>({
      query: () => '/posts-with-context',
      transformResponse: (baseData: PostsWithContext) => {
        const postsData = postsEntityAdapter.setAll(initialPostsData, baseData.posts);
        // We set the the current user to the first returned user: use proper authentication in a real app!
        const currentUser = baseData.users[0] ?? null;
        const usersData = { ...usersEntityAdapter.setAll(initialUsersData, baseData.users), currentUser };
        return ({ postsData, usersData });
      },
      providesTags: res => {
        const idTags = res ? res.postsData.ids.map(id => ({ type: 'Post', id })) : [];
        return [{ type: 'Post', id: 'LIST' }, ...idTags] as InvalidatedPost[];
      }
    }),
    getPost: builder.query<Post, EntityId>({
      query: postId => `/posts/${postId}`,
      providesTags: post => post ? [{ type: 'Post', id: post.id }] : [],
    }),
    addNewPost: builder.mutation<CreatedPostData, CreatePostData>({
      query: data => ({ url: '/posts', method: 'POST', body: data }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation<void, { postId: EntityId, data: UpdatePostData }>({
      query: ({ postId, data }) => ({ url: `/posts/${postId}`, method: 'PATCH', body: data }),
      invalidatesTags: (_res , _err, updPostData) => [{ type: 'Post', id: updPostData.postId }],
    }),
    addPostReaction: builder.mutation<{ added: boolean }, { postId: EntityId, data: CreateReactionData }>({
      query: arg => ({
        url: `/posts/${arg.postId}/reaction`,
        method: 'PUT',
        body: arg.data,
      }),
      // [Pessimistic local update] Update cached post instances if server reports that reaction was added.
      async onQueryStarted({ postId, data: reactionData }, mutApi)
      {
        const { data: { added } } = await mutApi.queryFulfilled;
        mutApi.dispatch(api.util.updateQueryData('getPost', postId, post => {
          if (added) post.reactions[reactionData.reaction] += 1;
        }));
        mutApi.dispatch(api.util.updateQueryData('getPostsWithContext', undefined, postsContextData => {
          const post = postsContextData.postsData.entities[postId];
          if (post && added) post.reactions[reactionData.reaction] += 1;
        }));
      }
    }),
  })
});

const selectPostsWithContextResult = api.endpoints.getPostsWithContext.select();

const selectPostsData = (state: RootState) => selectPostsWithContextResult(state).data?.postsData ?? initialPostsData;
const postsEntitySelectors = postsEntityAdapter.getSelectors((rs: RootState) => selectPostsData(rs));
export const selectAllPosts = postsEntitySelectors.selectAll;
export const selectPostById = (id: EntityId) => (s: RootState) => postsEntitySelectors.selectById(s, id) ?? null;
export const getSortedPosts = (postsData: PostsData) => sortedEntities(postsData, comparePosts);

export const selectUsersData = (state: RootState) => selectPostsWithContextResult(state).data?.usersData ?? initialUsersData;
const usersEntitySelectors = usersEntityAdapter.getSelectors((state: RootState) => selectUsersData(state));
export const selectAllUsers = usersEntitySelectors.selectAll;
export const selectUserById = (id: EntityId) => (state: RootState) => usersEntitySelectors.selectById(state, id) ?? null;
export const selectCurrentUser = (state: RootState) => selectUsersData(state)?.currentUser ?? null;

export const {
  useGetPostsWithContextQuery,
  useGetPostQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useAddPostReactionMutation,
} = api;
