import { useAppDispatch, useAppSelector } from '@/store';
import { clearNotification, selectNotification } from '@/features/notification';
import { Toast } from '@/components';
import React from 'react';
import { useRetryAction } from '@/hooks';

type NotificationProps = React.HTMLAttributes<HTMLDivElement> & {
  view: 'default' | 'mobile';
};

export function Notification({ view, className }: NotificationProps) {
  const notification = useAppSelector(selectNotification);
  const dispatch = useAppDispatch();
  const getCallback = useRetryAction();
  const retryCallback = getCallback(notification.retryAction);

  const handleClose = () => {
    dispatch(clearNotification());
  };

  const handleRetry = () => {
    retryCallback?.(notification.payload);
  };

  return (
    <Toast
      type={notification.type}
      view={view}
      className={className}
      hidden={!notification.visible}
      message={notification.message}
      retryCallback={handleRetry}
      handleClose={handleClose}
    />
  );
}
