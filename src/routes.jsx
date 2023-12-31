import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { node } from 'prop-types';

// pages
import Home from './pages/home';
import Program from './pages/program';
import Print from './pages/program/print';
import Announcements from './pages/announcements';
import SingleAnnouncement from './pages/announcements/SingleAnnouncement';
import NotFound from './pages/notFound';
// temp routes
import Initiative from './pages/temp/initiative';
// auth
import Login from './pages/login';
import SignUp from './pages/signUp';
/* admin */
import Admin from './pages/admin';
import Moderation from './pages/admin/moderation';
import Members from './pages/admin/members';
import Speakers from './pages/admin/speakers';
import Migrations from './pages/admin/migrations';
// layouts
import AdminLayout from './layouts/admin';
import AuthLayout from './layouts/auth';
import CenterLayout from './layouts/center';

import { setStorage } from './utils/localStorage.utils';
import { isEmpty } from './utils/data.utils';
import { useUser } from './providers/user.provider';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (loading) return null;
  /* save current location user is trying to link to
   * after they log in, they will be redirected. */
  if (isEmpty(user) && pathname !== '/') {
    setStorage('loginRedirect', pathname, 'session');
    /* making the redirect async to allow the component to finish rendering
     * if not, errors are thrown. */
    setTimeout(() => navigate('/login'), 100);
  }

  return children;
};

PrivateRoute.propTypes = {
  children: node,
};

function RoutesComp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CenterLayout />}>
          <Route index element={<Home />} />
          <Route path="program/:programId" element={<Program />} />
          <Route path="program" element={<Program />} />
          <Route path="program/print/:programId" element={<Print />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="announcements/:id" element={<SingleAnnouncement />} />
          {/* Temp Routes */}
          <Route path="temple-family-history-initiative" element={<Initiative />} />
        </Route>
        <Route path="program/print" element={<Print />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Admin />} />
          <Route path="moderation" element={<Moderation />} />
          <Route path="members" element={<Members />} />
          <Route path="sacrament-speakers" element={<Speakers />} />
          <Route path="migrations" element={<Migrations />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesComp;
