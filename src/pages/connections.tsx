import { Button, Card, RightBar } from '@/components';
import AddPeople from '@/assets/icons/AddPeople.svg?react';
import Activity from '@/assets/icons/Activity.svg?react';
import { ConnectionList, SuggestionList } from '@/features';

export default function Connections() {
  return (
    <main className="p-8 w-full flex gap-8">
      <div className="w-full">
        <header className="flex-between mb-8">
          <div>
            <h2>Connections</h2>
            <span className="text-grey-1 text-sm">You have 128 professional contacts</span>
          </div>
          <Button intent="primary" className="flex gap-2">
            <AddPeople />
            Invite New
          </Button>
        </header>
        <ConnectionList />
        <div>
          <h3>People you may know</h3>
          <SuggestionList />
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
