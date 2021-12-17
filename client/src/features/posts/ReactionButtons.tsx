import { Post, ReactionType } from '../../data-transfer';
import { useTypedSelector } from '../../app/store';
import { selectCurrentUser } from '../users/api';
import { useAddPostReactionMutation } from './api';

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
};

type ReactionButtonsProps = { post: Post };

export default function ReactionButtons({ post }: ReactionButtonsProps): JSX.Element
{
  const user = useTypedSelector(selectCurrentUser);

  const [addPostReaction] = useAddPostReactionMutation();

  const addReactionClicked = (reaction: ReactionType) => {
    if (user)
      return addPostReaction({ postId: post.id, data: { reaction, userId: user.id } });
  };

  const reactionButtons = Object.entries(reactionEmoji).map(([reactionType, emoji]) => {
    return (
      <button
        key={reactionType}
        disabled={user == null}
        type="button"
        className="muted-button reaction-button"
        onClick={() => addReactionClicked(reactionType as ReactionType)}>

        {emoji} {post.reactions[reactionType as ReactionType]}

      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};
