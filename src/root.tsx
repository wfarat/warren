import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Header } from '@/components';
import { Notifications, useAuthListener } from '@/features';
import { LeftNav } from '@/components/left-nav/LeftNav.tsx';
import { Messages } from '@/features/message/components/Messages.tsx';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://use.typekit.net/lqg1css.css" />
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
      <div className="flex bg-bg-1 pt-18.5 min-h-screen">
        <LeftNav />
        <AppContent />
      </div>
      <Notifications />
      <Messages />
    </Provider>
  );
}
