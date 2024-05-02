import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Login from './pages/Landing/Login';
import ErrorPage from './components/ErrorPage';
import Signup from './pages/Landing/Signup';
import About from './pages/Footer/About';
import Terms from './pages/Footer/Terms';
import PrivacyPolicy from './pages/Footer/PrivacyPolicy';
import Contact from './pages/Footer/Contact';
import Home from './pages/Dashboard/Home';
import Search from './pages/Dashboard/Search';
import Create from './pages/Dashboard/Create';
import Notifications from './pages/Dashboard/Notifications';
import Profile from './pages/Dashboard/Profile';
import Settings from './pages/Dashboard/Settings';

import LandingLayout from './components/layouts/LandingLayout';
import FooterLayout from './components/layouts/FooterLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Login /> },
      { path: 'signup', element: <Signup /> },
    ],
  },
  {
    path: '/',
    element: <FooterLayout />,
    errorElement: <ErrorPage />,
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
    errorElement: <ErrorPage />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'search', element: <Search /> },
      { path: 'create', element: <Create /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

function App() {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
