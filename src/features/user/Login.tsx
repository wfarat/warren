import Logo from 'assets/logo.svg?react';
import { Button, Panel, type PanelType } from 'components';
import GridLogo from 'assets/grid-logo.svg?react';
import type { Dispatch, SetStateAction } from 'react';

type Props = {
  handlePanel: Dispatch<SetStateAction<PanelType>>;
};

export const Login = ({ handlePanel }: Props) => {
  return (
    <Panel handleClose={() => handlePanel('')}>
      <div className="flex-between min-h-full flex-col gap-6 py-4">
        <div className="flex flex-2 flex-col justify-end pb-10">
          <Logo className="w-66 h-15.5" />
        </div>
        <div className="flex-center flex-1 flex-col gap-4">
          <Button onClick={() => handlePanel('user')} size="xxl">
            Log in
          </Button>

          <p className="text-white text-xs">by</p>
          <GridLogo />
        </div>
      </div>
    </Panel>
  );
};
