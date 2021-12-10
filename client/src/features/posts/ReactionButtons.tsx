import React from 'react';
import { Post, ReactionType } from '../../data-transfer';
import { addPostReaction } from './posts-slice';
import { useAppDispatch, useTypedSelector } from '../../app/state/store';
import { selectCurrentUserId } from '../../features/users/users-slice';

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
};

type ReactionButtonsProps = { post: Post };

const ReactionButtons = ({ post }: ReactionButtonsProps) => {
  const dispatch = useAppDispatch();
  const userId = useTypedSelector(selectCurrentUserId);

  const addReaction = (reaction: ReactionType) => {
    if (userId)
      return dispatch(addPostReaction({ postId: post.id, reaction, userId }));
  };

  const reactionButtons = Object.entries(reactionEmoji).map(([reactionType, emoji]) => {
    return (
      <button
        key={reactionType}
        disabled={userId == null}
        type="button"
        className="muted-button reaction-button"
        onClick={() => addReaction(reactionType as ReactionType)}
      >
        {emoji} {post.reactions[reactionType as ReactionType]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
