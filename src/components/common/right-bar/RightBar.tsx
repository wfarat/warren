import React from 'react';

export function RightBar({ children }: { children: React.ReactNode }) {
  return <div className="min-w-100 border-l border-grey-2">{children}</div>;
}
