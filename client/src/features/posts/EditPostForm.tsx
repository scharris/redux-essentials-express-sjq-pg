import React, { ChangeEventHandler, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useAppDispatch, useTypedSelector } from '../../app/state/store';
import { selectPostById, updatePost } from './posts-slice';

type TParams = { postId: string };

export const EditPostForm = ({ match }: RouteComponentProps<TParams>) => {
  const { postId } = match.params;

  const post = useTypedSelector(selectPostById(postId));

  const [title, setTitle] = useState(post?.title ?? '');
  const [content, setContent] = useState(post?.content ?? '');

  const dispatch = useAppDispatch();
  const history = useHistory();

  const onTitleChanged: ChangeEventHandler<HTMLInputElement> = (e) => setTitle(e.target.value);
  const onContentChanged: ChangeEventHandler<HTMLTextAreaElement> = (e) => setContent(e.target.value);

  const onSavePostClicked = () => {
    if (post && title && content)
    {
      dispatch(updatePost({ ...post, title, content }));
      history.push(`/posts/${postId}`);
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea id="postContent" name="postContent" value={content} onChange={onContentChanged} />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        Save Post
      </button>
    </section>
  );
};
