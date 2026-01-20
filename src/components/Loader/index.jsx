import styled, { keyframes } from 'styled-components';

import { colorBlue3 } from '../../styles/variables';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const bounceAnimation = keyframes`
  0%, 80%, 100% {
    transform: scaleY(0.5);
    opacity: 0.5;
  }
  40% {
    transform: scaleY(1);
    opacity: 1;
  }
`;

const BarsContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  height: 40px;
`;

const Bar = styled.div`
  width: 6px;
  height: 100%;
  background-color: ${colorBlue3};
  border-radius: 3px;
  animation: ${bounceAnimation} 1.2s infinite ease-in-out;
  animation-delay: ${(props) => props.$delay};
`;

function Loader({ ...rest }) {
  return (
    <LoaderContainer {...rest}>
      <BarsContainer>
        <Bar $delay="0s" />
        <Bar $delay="0.1s" />
        <Bar $delay="0.2s" />
        <Bar $delay="0.3s" />
        <Bar $delay="0.4s" />
      </BarsContainer>
    </LoaderContainer>
  );
}

export default styled(Loader)``;
