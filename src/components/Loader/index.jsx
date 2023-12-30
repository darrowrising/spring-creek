import Reactloader from 'react-loading';
import styled from 'styled-components';

import { colorBlue3 } from '../../styles/variables';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledReactLoader = styled(Reactloader).attrs(() => ({
  color: colorBlue3,
  type: 'bars',
}))``;

function Loader({ ...rest }) {
  return (
    <LoaderContainer {...rest}>
      <StyledReactLoader />
    </LoaderContainer>
  );
}

export default styled(Loader)``;
