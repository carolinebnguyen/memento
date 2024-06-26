import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Login from './pages/Landing/Login';
import Signup from './pages/Landing/Signup';
import About from './pages/Footer/About';
import Terms from './pages/Footer/Terms';
import PrivacyPolicy from './pages/Footer/PrivacyPolicy';
import Contact from './pages/Footer/Contact';
import Home from './pages/Dashboard/Home';
import Search from './pages/Dashboard/Search';
import Create from './pages/Dashboard/Create';
import Drafts from './pages/Dashboard/Drafts';
import Messages from './pages/Dashboard/Messages';
import Notifications from './pages/Dashboard/Notifications';
import Profile from './pages/Dashboard/Profile';
import Settings from './pages/Dashboard/Settings';
import Post from './pages/Dashboard/Post';

import LandingLayout from './components/layouts/LandingLayout';
import FooterLayout from './components/layouts/FooterLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

import theme from './theme/theme';
import ContextWrapper from './contexts/ContextWrapper';
import ErrorComponent from './components/ErrorComponent';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    errorElement: <ErrorComponent errorType="NOT_FOUND" />,
    children: [
      { index: true, element: <Login /> },
      { path: 'signup', element: <Signup /> },
    ],
  },
  {
    path: '/',
    element: <FooterLayout />,
    errorElement: <ErrorComponent errorType="NOT_FOUND" />,
    children: [
      { path: 'about', element: <About /> },
      { path: 'terms', element: <Terms /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
  {
    path: '/',
    element: <DashboardLayout />,
    errorElement: <ErrorComponent errorType="NOT_FOUND" />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'search', element: <Search /> },
      { path: 'create', element: <Create /> },
      { path: 'create/draft', element: <Drafts /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'profile/:username', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'post/:postId', element: <Post /> },
    ],
  },
  {
    path: '/messages/:conversationId?',
    element: <Messages />,
    errorElement: <ErrorComponent errorType="NOT_FOUND" />,
  },
]);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ContextWrapper>
        <RouterProvider router={router} />
      </ContextWrapper>
    </ChakraProvider>
  );
}

export default App;
