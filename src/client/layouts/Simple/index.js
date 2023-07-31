import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import { node } from 'prop-types';
import { useLocation } from 'react-router-dom';

import { UserContext } from '../../providers/User.old.provider';
import { updateMemberStatsOld } from '../../../js/utils/analytics.old.utils';

const LayoutContainer = styled.div`
  text-align: center;
  height: calc(100% - 48px);
  width: 100%;
`;

function Simple({ children, ...rest }) {
  const { user } = useContext(UserContext);
  const { pathname } = useLocation();

  useEffect(() => {
    if (user) {
      const { stats } = user;
      updateMemberStatsOld(user.uid, stats, pathname);
    }
  }, [pathname]);

  return <LayoutContainer {...rest}>{children}</LayoutContainer>;
}

Simple.propTypes = {
  children: node.isRequired,
};

export default Simple;
