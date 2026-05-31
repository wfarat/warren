import { route, type RouteConfig } from '@react-router/dev/routes';

export default [
  route('/newsfeed', 'pages/newsfeed.tsx'),
  route('*?', 'catchall.tsx'),
] satisfies RouteConfig;
