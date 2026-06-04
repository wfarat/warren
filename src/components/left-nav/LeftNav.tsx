import { NavLink } from 'react-router';
import NewsIcon from '@/assets/icons/News.svg?react';
import People from '@/assets/icons/People.svg?react';
import Grid from '@/assets/icons/Grid.svg?react';
import Profile from '@/assets/icons/Profile.svg?react';
import './left_nav.css';
import { useAppSelector } from '@/store';
import { selectCurrentUserId } from '@/features';

export function LeftNav() {
  const userId = useAppSelector(selectCurrentUserId);
  return (
    <nav className="pt-6 flex-col flex gap-2 w-64 border-r border-grey-2 bg-bg-2">
      <NavLink to="/" className="flex-start px-4 py-3 gap-2">
        <NewsIcon />
        Newsfeed
      </NavLink>
      <NavLink to="/friends" className="flex-start px-4 py-3 gap-2">
        <People />
        Friends
      </NavLink>
      <NavLink to="/groups" className="flex-start px-4 py-3 gap-2">
        <Grid />
        Groups
      </NavLink>
      <NavLink to={`/profile/${userId}`} className="flex-start px-4 py-3 gap-2">
        <Profile />
        Profile
      </NavLink>
    </nav>
  );
}
