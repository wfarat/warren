import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically cleanup the DOM after each test to prevent memory leaks
afterEach(() => {
  cleanup();
});
