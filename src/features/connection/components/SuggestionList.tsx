import type { Follower } from '@/types';
import { SuggestionCard } from '@/features';

type Props = {
  followers: Follower[];
};
export const SuggestionList = ({ followers }: Props) => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {followers.map((follower) => (
        <SuggestionCard key={follower.targetUserId} follower={follower} />
      ))}
    </div>
  );
};
