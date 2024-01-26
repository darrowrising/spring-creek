// #region imports
// import {} from 'react';
import styled, { keyframes } from 'styled-components';
// import {} from 'prop-types';
// #endregion imports
// #region MakeProgram
// #region styles
const breatheAnimation = keyframes`
 0% { height: 100px; width: 100px; }
 30% { height: 400px; width: 400px; opacity: 1 }
 40% { height: 405px; width: 405px; opacity: 0.3; }
 100% { height: 100px; width: 100px; opacity: 0.6; }`;

const Test = styled.div`
  animation-name: ${breatheAnimation};
  animation-duration: 8s;
  animation-iteration-count: infinite;
`;
// #endregion styles
// #region component
function MakeProgram() {
  return <Test>lets make a program</Test>;
}

// MakeProgram.propTypes = {

// };

export default MakeProgram;
// #endregion component
// #endregion MakeProgram
