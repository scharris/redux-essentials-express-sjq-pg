import React, { ChangeEventHandler, useState } from 'react';
import { addNewPost } from './posts-slice';
import { unwrapResult } from '@reduxjs/toolkit';
import { selectCurrentUser } from '../users/users-slice';
import { useAppDispatch, useTypedSelector } from '../../app/state/store';

export const AddPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');

  const dispatch = useAppDispatch();

  const user = useTypedSelector(selectCurrentUser);

  const onTitleChanged: ChangeEventHandler<HTMLInputElement> = (e) => setTitle(e.currentTarget.value);
  const onContentChanged: ChangeEventHandler<HTMLTextAreaElement> = (e) => setContent(e.target.value);

  const canSave = [title, content].every(Boolean) && addRequestStatus === 'idle' && user;

  const onSavePostClicked = async () => {
    if (canSave) {
      try
      {
        setAddRequestStatus('pending');
        const resultAction = await dispatch(addNewPost({ title, content, user: user.id }));
        unwrapResult(resultAction);
        setTitle('');
        setContent('');
      }
      catch (err)
      {
        console.error('Failed to save the post: ', err);
      }
      finally
      {
        setAddRequestStatus('idle');
      }
    }
  };

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id="postTitle" name="postTitle" value={title} onChange={onTitleChanged} />
        Author: {user?.name}
        <label htmlFor="postContent">Content:</label>
        <textarea id="postContent" name="postContent" value={content} onChange={onContentChanged} />
        <button type="button" onClick={onSavePostClicked}>
          Save Post
        </button>
      </form>
    </section>
  );
};
