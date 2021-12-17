import { EntityId } from '@reduxjs/toolkit';
import { useTypedSelector } from '../../app/store';
import { selectUserById } from '../users/api';

type Props = { userId: EntityId };

export default function PostAuthor({ userId }: Props)
{
  const author = useTypedSelector(selectUserById(userId));
  return <span>by {author ? author.name : 'Unknown author'}</span>;
};
