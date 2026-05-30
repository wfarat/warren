import { useAppDispatch, useAppSelector } from '../store';
import { selectLocation, setError, setSuccess, setUserLocation } from '../features';
import { useCallback } from 'react';

export function useLocation() {
  const dispatch = useAppDispatch();
  const location = useAppSelector(selectLocation);
  const setLocation = (position: { lat: number; lng: number }) => {
    dispatch(setUserLocation(position));
  };
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      dispatch(setError({ message: 'Geolocation is not supported by your browser' }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        dispatch(setSuccess('User location has been set successfully.'));
      },
      (err) => {
        dispatch(setError({ message: err.message, retryAction: 'LOCATION' }));
      }
    );
  }, []);

  return { location, setLocation, getLocation };
}
