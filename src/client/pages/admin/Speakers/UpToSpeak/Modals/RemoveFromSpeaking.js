import React from 'react';
import { shape } from 'prop-types';

const RemoveFromSpeaking = ({ record }) => {
  console.log('record', record);
  return <div>remove</div>;
};

RemoveFromSpeaking.propTypes = {
  record: shape(),
};

RemoveFromSpeaking.defaultProps = {
  record: {},
};

export default RemoveFromSpeaking;
