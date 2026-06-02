import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Header } from '@/components';
import { Notification, useAuthListener } from '@/features';
import { LeftNav } from '@/components/left-nav/LeftNav.tsx';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AppContent() {
  useAuthListener();

  return <Outlet />;
}
export default function Root() {
  return (
    <Provider store={store}>
      <Header />
      <div className="flex gap-2 pt-20 bg-bg-2">
        <LeftNav />
        <AppContent />
      </div>
      <footer className="bg-bg-3 h-1/4 flex-center">
        <Notification view={'default'} />
      </footer>
    </Provider>
  );
}
