import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Login from './pages/Landing/Login';
import ErrorPage from './components/ErrorPage';
import Signup from './pages/Landing/Signup';
import About from './pages/Footer/About';
import TermsConditions from './pages/Footer/TermsConditions';
import PrivacyPolicy from './pages/Footer/PrivacyPolicy';
import Contact from './pages/Footer/Contact';
import Layout from './components/Layout';
import Home from './pages/Dashboard/Home';
import Notifications from './pages/Dashboard/Notifications';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/about',
    element: <About />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/terms',
    element: <TermsConditions />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPolicy />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/contact',
    element: <Contact />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'notifications', element: <Notifications /> },
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
