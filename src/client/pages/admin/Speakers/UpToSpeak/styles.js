import styled from 'styled-components';
import theme from 'theme';

export const UpToSpeakContainer = styled.div`
  & .notes {
    min-width: 100px;
  }
`;

export const NotSpoken = styled.span`
  color: ${theme('color_warning')};
`;
