import { ChangeEventHandler, useState } from 'react';
import { selectCurrentUser } from '../users/api';
import { useTypedSelector } from '../../app/store';
import { useAddNewPostMutation } from './api';

export default function AddPostForm(): JSX.Element
{
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [addNewPost, { isLoading }] = useAddNewPostMutation();

  const user = useTypedSelector(selectCurrentUser);

  const onTitleChanged: ChangeEventHandler<HTMLInputElement> = (e) => setTitle(e.currentTarget.value);
  const onContentChanged: ChangeEventHandler<HTMLTextAreaElement> = (e) => setContent(e.target.value);

  const canSave = user && !isLoading && [title, content].every(Boolean);

  const onSavePostClicked = async () => {
    if (canSave)
    {
      try
      {
        const result = await addNewPost({ title, content, user: user.id }).unwrap();
        console.info(`Created post with id ${result.id}.`);
        setTitle('');
        setContent('');
      }
      catch (err)
      {
        console.error('Failed to save the post: ', err);
      }
    }
  };

  if (isLoading) return <span>Loading...</span>
  else return (
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
