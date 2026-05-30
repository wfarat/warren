import React, { type JSX, type PropsWithChildren } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { notificationReducer } from 'features/notification/notificationSlice';
import type { RootState } from '../store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: RootState;
  store?: ReturnType<typeof configureStore<RootState>>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {} as RootState,
    store = configureStore({
      reducer: {
        notification: notificationReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
