import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Login from './pages/Landing/Login';
import ErrorPage from './components/ErrorPage';
import Signup from './pages/Landing/Signup';
import About from './pages/Footer/About';
import TermsConditions from './pages/Footer/TermsConditions';
import PrivacyPolicy from './pages/Footer/PrivacyPolicy';
import Contact from './pages/Footer/Contact';
import Home from './pages/Dashboard/Home';

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
    path: '/home',
    element: <Home />,
    errorElement: <ErrorPage />,
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
