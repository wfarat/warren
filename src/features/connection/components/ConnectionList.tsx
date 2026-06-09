import type { Follower } from '@/types/followers.ts';
import { ConnectionCard } from '@/features';

type Props = {
  connections: Follower[];
};

export function ConnectionList({ connections }: Props) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {connections.map((connection) => (
        <ConnectionCard key={connection.targetUserId} connection={connection} />
      ))}
    </div>
  );
}
