import { useAppSelector } from '@/store';
import { Notification, selectNotifications } from '@/features';
import { createPortal } from 'react-dom';

export function Notifications() {
  const notifications = useAppSelector(selectNotifications);

  return createPortal(
    <div className="fixed top-30 right-15 flex flex-col gap-4 z-10">
      {notifications.map((notification) => (
        <Notification view="default" key={notification.id} notification={notification} />
      ))}
    </div>,
    document.body
  );
}
