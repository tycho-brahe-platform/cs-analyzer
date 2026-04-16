import Home from '@/pages/Home';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import ErrorPage from './session/ErrorPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route path="/" element={<Home />} />
    </Route>
  )
);

export default function PublicRoutes() {
  return <RouterProvider router={router} />;
}
