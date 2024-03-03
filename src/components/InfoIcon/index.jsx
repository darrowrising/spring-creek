// #region imports
// import {} from 'react';
// import styled from 'styled-components';
import { string } from 'prop-types';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
// #endregion imports
// #region InfoIcon
// #region styles

// #endregion styles
// #region component
function InfoIcon({ text = '', ...rest }) {
  return (
    <Tooltip title={text} {...rest}>
      <InfoCircleOutlined />
    </Tooltip>
  );
}

InfoIcon.propTypes = {
  text: string,
};

export default InfoIcon;
// #endregion component
// #endregion InfoIcon
