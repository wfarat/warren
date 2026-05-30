import SearchIcon from '@/assets/icons/Search.svg?react';
import { useState } from 'react';
import Fuse from 'fuse.js';

export function Search() {
  const [searchTerm, setSearchTerm] = useState('');

  const dummyData = [
    { id: 1, name: 'Friedrich Nietzsche', affiliation: 'CEO' },
    { id: 2, name: 'Soren Kierkegaard', affiliation: 'CTO' },
  ];
  const fuse = new Fuse(dummyData, {
    keys: ['name', 'address'],
    includeScore: true,
    threshold: 0.4,
  });
  const results = fuse.search(searchTerm);
  const filteredData = results.map((result) => result.item);
  const isDropdownVisible = searchTerm.length > 0 && filteredData.length > 0;

  const inputContainerClasses = [
    'flex items-center p-1 w-full bg-transparent border border-white/25',
    'z-10',
    isDropdownVisible ? 'rounded-t-2xl border-b-0' : 'rounded-2xl',
  ].join(' ');

  return (
    <div className="relative w-96 z-20">
      {/* 1. The Search Input Container */}
      <div className={inputContainerClasses}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type name..."
          className="p-2 bg-transparent outline-none w-full text-white text-sm placeholder:opacity-60"
        />
        <SearchIcon className="mr-1" />
      </div>
      {isDropdownVisible && (
        <div className="absolute left-0 w-full bg-bg-2 border border-t-0 rounded-b-2xl top-full border-white/25 shadow-lg overflow-hidden z-20">
          <div className="border-t-0 rounded-b-lg">
            {filteredData.map((person) => (
              <div
                key={person.id}
                className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white/90"
                onClick={() => console.log('Person selected:', person)}
              >
                <div className="font-semibold">{person.name}</div>
                <div className="text-xs text-white/50">{person.affiliation}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
