import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { useLogin } from './useLogin';
import { useAppDispatch } from 'store';
import { signInWithPopup, signOut, type User, type UserCredential } from 'firebase/auth';
import { clearUser, setUser } from './userSlice';
import { setError, setSuccess } from '../notification';

vi.mock('store', () => ({
  useAppDispatch: vi.fn(),
}));

vi.mock('./userSlice', () => ({
  setUser: vi.fn((user) => ({ type: 'user/setUser', payload: user })),
  clearUser: vi.fn(() => ({ type: 'user/clearUser' })),
}));

vi.mock('../notification/notificationSlice', () => ({
  setSuccess: vi.fn((msg) => ({ type: 'notification/setSuccess', payload: msg })),
  setError: vi.fn((err) => ({ type: 'notification/setError', payload: err })),
}));

vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: vi.fn(
    class {
      setCustomParameters = vi.fn();
    }
  ),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('api/firebase', () => ({
  auth: {},
}));

describe('useLogin hook', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppDispatch).mockReturnValue(dispatch);
  });

  it('should dispatch setUser, getUserDevices, and success message on successful login', async () => {
    const mockUser = {
      displayName: 'John Doe',
      email: 'john@griddynamics.com',
      photoURL: 'https://photo.url',
    };

    vi.mocked(
      signInWithPopup as unknown as Mocked<() => Partial<UserCredential>>
    ).mockResolvedValue({
      user: mockUser as User,
    });

    const { result } = renderHook(() => useLogin());
    await result.current.login();

    expect(setUser).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@griddynamics.com',
      given_name: 'John',
      photoUrl: 'https://photo.url',
    });

    expect(dispatch).toHaveBeenCalledWith(setUser(expect.anything()));
    expect(dispatch).toHaveBeenCalledWith(setSuccess('User logged in successfully.'));
  });

  it('should dispatch setError when login fails', async () => {
    const error = new Error('Popup closed by user');
    vi.mocked(signInWithPopup).mockRejectedValue(error);

    const { result } = renderHook(() => useLogin());
    await result.current.login();

    expect(dispatch).toHaveBeenCalledWith(
      setError({ message: error.message, retryAction: 'LOGIN' })
    );
  });

  it('should dispatch clearUser and success message on successful logout', async () => {
    vi.mocked(signOut).mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogin());
    await result.current.logout();

    expect(signOut).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(clearUser());
    expect(dispatch).toHaveBeenCalledWith(setSuccess('User logged out successfully.'));
  });
});
