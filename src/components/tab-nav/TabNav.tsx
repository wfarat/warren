import { TabButton } from './TabButton';

export type TabOption<T extends string> = {
  id: T;
  label: string;
};

type TabNavProps<T extends string> = {
  options: TabOption<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
};

export function TabNav<T extends string>({
  options,
  activeTab,
  onChange,
  className = '',
}: TabNavProps<T>) {
  return (
    <div className={`px-8 border-b border-grey-2 w-full flex gap-2 ${className}`}>
      {options.map((tab) => (
        <TabButton
          key={tab.id}
          label={tab.label}
          active={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
        />
      ))}
    </div>
  );
}
