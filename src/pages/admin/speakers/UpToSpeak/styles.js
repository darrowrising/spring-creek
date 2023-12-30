import styled from 'styled-components';

export const UpToSpeakContainer = styled.div`
  position: relative;

  & .cell {
    min-width: 100px;
  }

  &.editable > textarea {
    padding: 0;
  }

  & tr td.editable {
    cursor: pointer;

    &:has(textarea) {
      padding: 0;
    }

    &:hover {
      background-color: #d99e3621;
    }
  }
`;

export const NotSpoken = styled.span`
  color: var(--color-warning);
`;
