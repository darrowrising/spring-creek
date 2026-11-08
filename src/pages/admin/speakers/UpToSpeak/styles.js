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
    padding: 0;

    &:hover {
      background-color: #d99e3621;
    }
  }
`;

export const NotSpoken = styled.span`
  color: var(--color-warning);
`;

export const NoteCell = styled.div`
  box-sizing: border-box;
  width: 100%;
  min-height: 32px;
  padding: var(--space-1) 10px;
  font-size: inherit;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;

  &:not(:has(textarea)) {
    border: 1px solid transparent;
    border-radius: 6px;
  }

  &:not(:has(textarea)):hover {
    border-color: #d99e3666;
    background: #d99e3612;
  }
`;

export const NoteUpdatedAt = styled.div`
  margin-bottom: 4px;
  font-size: 11px;
  line-height: 1.2;
  letter-spacing: 0.2px;
  color: var(--color-grey-1);
  white-space: nowrap;
`;
