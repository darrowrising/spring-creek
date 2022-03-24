import React, { useEffect, useContext } from 'react';
import { node, boolean } from 'prop-types';
import { useLocation } from 'react-router-dom';
// providers
import { UserContext } from '../../providers/User.old.provider';
// utils
import { updateMemberStatsOld } from '../../../js/utils/analytics.old.utils';
// styles
// import {} from './OldLayout.styles';

function OldLayout({ responsive, children, ...rest }) {
  const { user } = useContext(UserContext);
  const { pathname } = useLocation();

  useEffect(() => {
    if (user) {
      const { stats } = user;
      updateMemberStatsOld(user.uid, stats, pathname);
    }
  }, [pathname]);

  return (
    <div className="page center container" {...rest}>
      <div className="content-width" style={{ maxWidth: responsive ? '100%' : '960px' }}>
        {children}
      </div>
    </div>
  );
}

OldLayout.propTypes = {
  children: node.isRequired,
  responsive: boolean,
};

OldLayout.defaultProps = {
  responsive: false,
};

export default OldLayout;
