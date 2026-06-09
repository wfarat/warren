import { route, type RouteConfig } from '@react-router/dev/routes';

export default [
  route('/', 'pages/newsfeed.tsx'),
  route('/profile/:userId', 'pages/profile.tsx'),
  route('/post/:postId', 'pages/post.tsx'),
  route('/connections', 'pages/connections.tsx'),
  route('*?', 'catchall.tsx'),
] satisfies RouteConfig;
