import { keyframes } from 'styled-components';

export const fadeIn = keyframes`
0% {
  opacity: 0;
}
100% {
  opacity: 1;
}
`;

export const approveSlideOut = keyframes`
0% {
  opacity: 1;
  transform: translateY(0);
  max-height: 2000px;
  margin-bottom: 0;
}
100% {
  opacity: 0;
  transform: translateY(-12px);
  max-height: 0;
  margin-top: 0;
  margin-bottom: calc(-1 * var(--space-2));
  padding-top: 0;
  padding-bottom: 0;
}
`;
