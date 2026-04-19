import Home from '@/pages/Home';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import WrapperOutlet from './WrapperOutlet';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<WrapperOutlet />}>
      <Route path="/" element={<Home />} />
    </Route>
  )
);

export default function PublicRoutes() {
  return <RouterProvider router={router} />;
}
