import styled from 'styled-components';
import theme from 'theme';
// components
import Heading from '../../../../../components/Heading';

export const StyleHeading = styled(Heading)`
  margin-top: 0;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding-bottom: 40px;
`;

export const ButtonGroup = styled.div`
  border-top: 1px solid ${theme('color_grey_3')};
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  padding-top: 20px;
`;
