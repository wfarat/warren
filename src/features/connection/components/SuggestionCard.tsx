import { Card } from '@/components';
import type { Follower } from '@/types';
import { NavLink } from 'react-router';

export function SuggestionCard({ follower }: { follower: Follower }) {
  return (
    <NavLink to={`/profile/${follower.targetUserId}`}>
      <Card></Card>
    </NavLink>
  );
}
