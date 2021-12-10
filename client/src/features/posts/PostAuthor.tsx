import React from 'react';
import { EntityId } from '@reduxjs/toolkit';
import { useTypedSelector } from '../../app/state/store';
import { selectUserById } from '../users/users-slice';

type PostAuthorProps = { userId: EntityId };

const PostAuthor = ({ userId }: PostAuthorProps) => {
  const author = useTypedSelector((state) => selectUserById(state, userId));
  return <span>by {author ? author.name : 'Unknown author'}</span>;
};

export default PostAuthor;
