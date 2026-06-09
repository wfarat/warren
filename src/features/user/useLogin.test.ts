import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import { useLogin } from './useLogin';
import { useAppDispatch } from '@/store';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { clearUser, setError, setSuccess } from '@/features';
import { userRepo } from '@/api'; // 🌟 Add repo mock access

vi.mock('@/store', () => ({
  useAppDispatch: vi.fn(),
}));

vi.mock('@/features/user/userSlice', () => ({
  setUser: vi.fn((user) => ({ type: 'user/setUser', payload: user })),
  clearUser: vi.fn(() => ({ type: 'user/clearUser' })),
}));

vi.mock('@/features/notification/notificationSlice', () => ({
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
  getAuth: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(), // 🌟 Mock our new registration dependency
}));

vi.mock('@/api', () => ({
  auth: {},
  // 🌟 Mock userRepo so it doesn't try to touch a live Firestore database instance during test runs
  userRepo: {
    initializeUserDocument: vi.fn().mockResolvedValue({
      id: 'mock-uid',
      name: 'John Doe',
      followers: 0,
      following: 0,
      bio: '',
      location: '',
    }),
  },
}));

describe('useLogin hook', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppDispatch).mockReturnValue(dispatch);
  });

  // Test 1: Google Sign-In Flow
  it('should trigger popup sign-in and call success on successful Google login', async () => {
    const mockUser = {
      uid: 'mock-uid',
      displayName: 'John Doe',
      email: 'john@pjwstk.edu.pl',
      photoURL: 'https://photo.url',
    };

    vi.mocked(
      signInWithPopup as unknown as Mocked<() => Partial<UserCredential>>
    ).mockResolvedValue({
      user: mockUser as User,
    });

    const { result } = renderHook(() => useLogin());
    await result.current.loginWithGoogle();

    expect(signInWithPopup).toHaveBeenCalled();
    // 🌟 Check for your hook's real global success broadcast notification string
    expect(dispatch).toHaveBeenCalledWith(setSuccess(expect.any(String)));
  });

  // Test 2: New Registration Engine Flow
  it('should call auth creation, initialize firestore document, and broadcast success on valid registration', async () => {
    const mockUser = { uid: 'mock-uid', email: 'test@example.com' };

    vi.mocked(
      createUserWithEmailAndPassword as unknown as Mocked<() => Partial<UserCredential>>
    ).mockResolvedValue({
      user: mockUser as User,
    });

    const { result } = renderHook(() => useLogin());
    await result.current.registerWithEmail('test@example.com', 'password123', 'John Doe');

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      'test@example.com',
      'password123'
    );
    // Ensure repository initialization was triggered with the correct parameters
    expect(userRepo.initializeUserDocument).toHaveBeenCalledWith(mockUser, 'John Doe');
    expect(dispatch).toHaveBeenCalledWith(setSuccess('Account created successfully!'));
  });

  // Test 3: Google Failure Pipeline
  it('should dispatch setError when login fails', async () => {
    const error = new Error('Popup closed by user');
    vi.mocked(signInWithPopup).mockRejectedValue(error);

    const { result } = renderHook(() => useLogin());

    // Wrapped in try/catch since the hook re-throws errors downstream after broadcasting them to Redux
    try {
      await result.current.loginWithGoogle();
    } catch {
      // Intended re-throw bypass
    }

    expect(dispatch).toHaveBeenCalledWith(
      setError({ message: error.message, retryAction: 'LOGIN_GOOGLE' })
    );
  });

  // Test 4: Logout Verification
  it('should dispatch clearUser and success message on successful logout', async () => {
    vi.mocked(signOut).mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogin());
    await result.current.logout();

    expect(signOut).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(clearUser());
    expect(dispatch).toHaveBeenCalledWith(setSuccess('User logged out successfully.'));
  });
});
