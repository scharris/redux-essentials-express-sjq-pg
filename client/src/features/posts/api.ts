import { createEntityAdapter, EntityState, EntityId } from '@reduxjs/toolkit';
import { api as appApi } from '../../app/api';
import { RootState } from '../../app/store';
import {
  Post,
  CreatedPostData,
  UpdatedPostData,
  NewPostData,
  NewReactionData,
} from '../../data-transfer';
import { sortedEntities } from '../../util/entities';

type PostsData = EntityState<Post>;

const entityAdapter = createEntityAdapter<Post>({ sortComparer });

const initialData: PostsData = entityAdapter.getInitialState();

type InvalidatedPost = { type: 'Post', id: EntityId };

export const api = appApi.injectEndpoints({
  endpoints: builder => ({
    getPosts: builder.query<PostsData, void>({
      query: () => '/posts',
      transformResponse: (posts: Post[]) => {
        return entityAdapter.setAll(initialData, posts);
      },
      providesTags: res => {
        const idTags = res ? res.ids.map(id => ({ type: 'Post', id })) : [];
        return [{ type: 'Post', id: 'LIST' }, ...idTags] as InvalidatedPost[];
      }
    }),
    getPost: builder.query<Post, EntityId>({
      query: postId => `/posts/${postId}`,
      providesTags: post => post ? [{ type: 'Post', id: post.id }] : [],
    }),
    addNewPost: builder.mutation<CreatedPostData, NewPostData>({
      query: data => ({ url: '/posts', method: 'POST', body: data }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation<void, { postId: EntityId, data: UpdatedPostData }>({
      query: ({ postId, data }) => ({ url: `/posts/${postId}`, method: 'PATCH', body: data }),
      invalidatesTags: (_res , _err, updPostData) => [{ type: 'Post', id: updPostData.postId }],
    }),
    addPostReaction: builder.mutation<{ added: boolean }, { postId: EntityId, data: NewReactionData }>({
      query: arg => ({
        url: `/posts/${arg.postId}/reaction`,
        method: 'PUT',
        body: arg.data,
      }),
      // [Pessimistic local update] Update cached post instances if server reports that reaction was added.
      async onQueryStarted({ postId, data: reactionData }, mutApi)
      {
        const { data: { added } } = await mutApi.queryFulfilled;
        mutApi.dispatch(api.util.updateQueryData('getPost', postId, draftPost => {
          if (added) draftPost.reactions[reactionData.reaction] += 1;
        }));
        mutApi.dispatch(api.util.updateQueryData('getPosts', undefined, draftPostsData => {
          const post = draftPostsData.entities[postId];
          if (post && added) post.reactions[reactionData.reaction] += 1;
        }));
      }
    }),
  })
});

const selectPostsResult = api.endpoints.getPosts.select();
const selectPostsData = (state: RootState) => selectPostsResult(state)?.data ?? initialData;

const entitySelectors = entityAdapter.getSelectors((rs: RootState) => selectPostsData(rs));
export const selectAllPosts = entitySelectors.selectAll;
export const selectPostById = (id: EntityId) => (s: RootState) => entitySelectors.selectById(s, id) ?? null;

export const getSortedPosts = (postsData: PostsData) => sortedEntities(postsData, sortComparer);

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useAddPostReactionMutation,
} = api;

function sortComparer(p1: Post, p2: Post) { return p2.date.localeCompare(p1.date); }
