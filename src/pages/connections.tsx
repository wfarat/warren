import { Button, Card, RightBar } from '@/components';
import AddPeople from '@/assets/icons/AddPeople.svg?react';
import Activity from '@/assets/icons/Activity.svg?react';
import { ConnectionList, SuggestionList } from '@/features';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchConnections } from '@/features/connection/connectionActions.ts';
import { selectConnection } from '@/features/connection/connectionSelectors.ts';

export default function Connections() {
  const dispatch = useAppDispatch();
  const { mutualConnections, pureFollowers } = useAppSelector(selectConnection);
  useEffect(() => {
    dispatch(fetchConnections());
  }, [dispatch]);
  return (
    <main className="p-8 w-full flex gap-8">
      <div className="w-full">
        <header className="flex-between mb-8">
          <div>
            <h2>Connections</h2>
            <span className="text-grey-1 text-sm">
              You have {mutualConnections.length} professional contacts
            </span>
          </div>
          <Button intent="primary" className="flex gap-2">
            <AddPeople />
            Invite New
          </Button>
        </header>
        <ConnectionList connections={mutualConnections} />
        <div>
          <h3>People you may know</h3>
          <SuggestionList followers={pureFollowers} />
        </div>
      </div>
      <RightBar>
        <Card>
          <div className="flex-start gap-3">
            <Activity />
            <h4 className="text-on-surface font-normal text-lg">Recent Activity</h4>
          </div>
        </Card>
      </RightBar>
    </main>
  );
}
