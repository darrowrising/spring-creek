import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { node } from 'prop-types';

import { hasPermission } from './utils/permissions.utils';

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
import Hymns from './pages/admin/hymns';
import Moderation from './pages/admin/moderation';
import Members from './pages/admin/members';
import Speakers from './pages/admin/speakers';
import Migrations from './pages/admin/migrations';
import Conducting from './pages/admin/conducting';
import MakeProgram from './pages/admin/buildProgram';
// layouts
import AdminLayout from './layouts/admin';
import AuthLayout from './layouts/auth';
import CenterLayout from './layouts/center';

import { setStorage } from './utils/localStorage.utils';
import { isEmpty } from './utils/data.utils';
import { useUser } from './providers/user.provider';

// #region PrivateRoute
const PrivateRoute = ({ children }) => {
  const { user, isUserLoading } = useUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (isUserLoading) return null;
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
// #endregion PrivateRoute

// #region RoutePermissions
const RoutePermissions = ({ permissions, children }) => {
  const navigate = useNavigate();

  if (!hasPermission(permissions)) {
    setTimeout(() => {
      navigate('/admin');
    }, 100);
    return null;
  }

  return children;
};
// #endregion RoutePermissions

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
          <Route path="conducting" element={<Conducting />} />
          <Route path="conducting/:id" element={<Conducting />} />
          <Route path="hymns" element={<Hymns />} />
          <Route path="moderation" element={<Moderation />} />
          <Route path="members" element={<Members />} />
          <Route
            path="sacrament-speakers"
            element={
              <RoutePermissions permissions={['org:bishopric', 'calling:ward_clerk', 'page:sacrament-speakers']}>
                <Speakers />
              </RoutePermissions>
            }
          />
          <Route path="migrations" element={<Migrations />} />
          <Route path="build-program" element={<MakeProgram />} />
          <Route path="build-program/:id" element={<MakeProgram />} />
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
