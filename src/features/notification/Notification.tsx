import { useAppDispatch } from '@/store';
import { type NotificationData, removeNotification } from '@/features/notification';
import { Toast } from '@/components';
import React, { useEffect } from 'react';
import { useRetryAction } from '@/hooks';

type NotificationProps = React.HTMLAttributes<HTMLDivElement> & {
  view: 'default' | 'mobile';
  notification: NotificationData;
};

export function Notification({ view, className, notification }: NotificationProps) {
  const dispatch = useAppDispatch();
  const getCallback = useRetryAction();
  const retryCallback = getCallback(notification.retryAction);

  useEffect(() => {
    setTimeout(() => dispatch(removeNotification(notification.id)), 5000);
  }, []);
  const handleClose = () => {
    dispatch(removeNotification(notification.id));
  };

  const handleRetry = () => {
    retryCallback?.(notification.payload);
  };

  return (
    <Toast
      type={notification.type}
      view={view}
      className={className}
      message={notification.message}
      retryCallback={handleRetry}
      showRetry={retryCallback !== undefined}
      handleClose={handleClose}
    />
  );
}
