import styled from 'styled-components';
import Heading from '../../../../../components/Heading';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export const StyleHeading = styled(Heading)`
  margin-top: 0;
`;

export const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;
