import styled from 'styled-components';

import Program from '../../../../components/Program';

export const Space = styled.div`
  /* padding: var(--space-6); */
`;

export const Page = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: var(--space-6);
  padding-left: 0;

  .date {
    display: none;
  }

  & > ${Program} {
    background-color: var(--color-white-2);
    padding: 0 var(--space-4) 0 var(--space-8);
    border-left: 1px solid var(--color-white-2);

    .heading {
      font-size: 1.2em;
      padding-bottom: var(--space-2);
      border: none;
    }
  }

  @media print {
    overflow-x: hidden !important;
    font-size: 0.8em;
    height: 8.5in;
    width: 100%;

    & > ${Program} {
      background: none;
    }
  }
`;
