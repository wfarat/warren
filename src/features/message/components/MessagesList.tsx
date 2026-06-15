interface MessagesListProps {
  isOpen: boolean;
}

export function MessagesList({ isOpen }: MessagesListProps) {
  return (
    <div
      className={`
        grid transition-all duration-300 ease-in-out w-80 bg-bg-4 border-x border-grey-2
        ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
      `}
    >
      {/* This inner div must have overflow-hidden for the grid trick to work */}
      <div className="overflow-hidden">
        <div className="flex flex-col gap-2 p-4 h-96 overflow-y-auto">
          <div>Message 1</div>
          <div>Message 2</div>
          <div>Message 3</div>
        </div>
      </div>
    </div>
  );
}
