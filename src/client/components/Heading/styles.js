import styled from 'styled-components';
import { theme } from 'theme';

export const StyleHeading = styled.h2`
  color: ${({ color = 'primary' }) => theme(`color_${color}`)};
  font-family: ${theme('font_brand')};
  font-size: 2rem;
  margin-top: 20px;
`;
