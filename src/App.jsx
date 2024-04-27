import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Login from './pages/Landing/Login';
import ErrorPage from './components/ErrorPage';
import Registration from './pages/Landing/Signup';
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
    element: <Registration />,
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
