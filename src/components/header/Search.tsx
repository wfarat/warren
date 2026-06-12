import SearchIcon from '@/assets/icons/Search.svg?react';
import React, { useState } from 'react';
import Fuse from 'fuse.js';
import { twMerge } from 'tailwind-merge';
import type { UserListItem } from '@/types';
import { cld, userRepo } from '@/api';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from '@cloudinary/react'; // Assuming your fetch utility is here

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChoose?: (person: UserListItem) => void;
}

export function Search({ className, onChoose }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isDropdownVisible = searchTerm.length > 0 && searchResults.length > 0;

  const handleSearchSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const freshPeopleList = await userRepo.fetchUserList(searchTerm.trim());

      const fuse = new Fuse(freshPeopleList, {
        keys: ['name'],
        includeScore: true,
        threshold: 0.4,
      });

      const fuseResults = fuse.search(searchTerm);
      setSearchResults(fuseResults.map((result) => result.item));
    } catch (error) {
      console.error('Failed to execute user search:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (person: UserListItem) => {
    if (onChoose) onChoose(person);
    setSearchTerm('');
    setSearchResults([]);
  };

  const inputContainerClasses = [
    'flex items-center p-1 w-full bg-bg-3 border border-grey-2',
    'z-10',
    isDropdownVisible ? 'rounded-t-2xl border-b-0' : 'rounded-2xl',
  ].join(' ');

  return (
    <div className={twMerge('relative w-96 z-20', className)}>
      <form onSubmit={handleSearchSubmit} className={inputContainerClasses}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value === '') setSearchResults([]); // Clear dropdown if input is cleared
          }}
          placeholder={isLoading ? 'Searching...' : 'Type name...'}
          disabled={isLoading}
          className="p-2 bg-transparent outline-none w-full text-white text-sm placeholder:opacity-60 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-1 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
        >
          <SearchIcon />
        </button>
      </form>

      {isDropdownVisible && (
        <div className="absolute left-0 w-full bg-bg-3 border border-t-0 rounded-b-2xl top-full border-grey-2 shadow-lg overflow-hidden z-20">
          <div className="border-t-0 rounded-b-lg max-h-60 overflow-y-auto">
            {searchResults.map((person) => (
              <div
                key={person.id}
                className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white/90 flex-between"
                onClick={() => handleClick(person)}
              >
                <div>
                  <p className="font-semibold">{person.name}</p>
                  {person.profession && (
                    <span className="text-xs text-white/50">{person.profession}</span>
                  )}
                </div>
                <AdvancedImage
                  cldImg={cld
                    .image(`users/${person.id}/profile`)
                    .resize(fill().width(32).height(32))
                    .format('auto')}
                  className="rounded-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
