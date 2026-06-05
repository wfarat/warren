import React from 'react';

export function Card({ children }: React.PropsWithChildren) {
  return (
    <div className="border border-grey-2 bg-bg-3 p-6 relative flex flex-col gap-4 rounded-xl drop-shadow-bg-3">
      {children}
    </div>
  );
}
