import { ChangeEventHandler, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useTypedSelector } from '../../app/store';
import { selectPostById, useUpdatePostMutation } from './api';

type Props = RouteComponentProps<{ postId: string }>;

export default function EditPostForm({ match }: Props): JSX.Element
{
  const { postId } = match.params;

  const post = useTypedSelector(selectPostById(postId));
  const [updatePost] = useUpdatePostMutation();

  const [title, setTitle] = useState(post?.title ?? '');
  const [content, setContent] = useState(post?.content ?? '');

  const history = useHistory();

  const onTitleChanged: ChangeEventHandler<HTMLInputElement> = (e) => setTitle(e.target.value);
  const onContentChanged: ChangeEventHandler<HTMLTextAreaElement> = (e) => setContent(e.target.value);

  const onSavePostClicked = () => {
    if (post && title && content)
    {
      updatePost({ postId, data: { title, content } });
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
