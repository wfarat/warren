import React from 'react';

export function RightBar({ children }: { children: React.ReactNode }) {
  return <div className="w-80 border-l border-grey-2">{children}</div>;
}
