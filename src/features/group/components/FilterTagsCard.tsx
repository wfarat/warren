import { useAppDispatch, useAppSelector } from '@/store';
import { Card, Tag } from '@/components';
import { selectGroup, setGroupTagFilter } from '@/features';

export function FilterTagsCard() {
  const dispatch = useAppDispatch();

  const { discoverGroups, tagFilter } = useAppSelector(selectGroup);

  const availableTags = Array.from(new Set(discoverGroups.flatMap((group) => group.tags))).sort();

  const handleTagToggle = (tag: string) => {
    if (tagFilter === tag) {
      dispatch(setGroupTagFilter(''));
    } else {
      dispatch(setGroupTagFilter(tag));
    }
  };

  if (availableTags.length === 0 && !tagFilter) return null;

  return (
    <Card className="w-full flex-col p-4 bg-bg-3 border-grey-2 gap-4 min-h-100">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <h4 className="text-white text-sm font-semibold tracking-tight">Filter by Tag</h4>
          <p className="text-grey-1 text-[11px]">Narrow down your community search</p>
        </div>

        {tagFilter && (
          <button
            type="button"
            onClick={() => dispatch(setGroupTagFilter(''))}
            className="text-xs text-primary-light hover:text-primary transition-colors cursor-pointer font-medium"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 w-full max-h-48 pr-1">
        {availableTags.map((tag) => {
          const isActive = tagFilter === tag;

          return (
            <Tag
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`transition-all duration-200 select-none ${
                isActive
                  ? 'bg-primary text-on-primary border-primary ring-2 ring-primary/20 scale-105'
                  : 'bg-grey-2 hover:bg-grey-1/30 text-on-surface'
              }`}
            >
              {tag}
            </Tag>
          );
        })}
      </div>
    </Card>
  );
}
