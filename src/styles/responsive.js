import { css } from 'styled-components';
import { media } from './variables';

// Common responsive patterns
export const responsiveGrid = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-4);

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
`;

export const responsiveFlex = css`
  display: flex;
  gap: var(--space-3);
  align-items: center;

  ${media.tablet} {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
  }
`;

export const responsiveTable = css`
  ${media.tablet} {
    overflow-x: auto;

    .ant-table {
      min-width: 600px;
    }
  }
`;

export const responsiveModal = css`
  ${media.tablet} {
    .ant-modal {
      margin: var(--space-2);
      max-width: calc(100vw - var(--space-4));
    }
  }
`;

export const responsiveButtonGroup = css`
  ${media.tablet} {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
`;

export const responsiveForm = css`
  ${media.tablet} {
    .ant-form-item {
      margin-bottom: var(--space-3);
    }
  }
`;

// Helper function for responsive spacing
export const getResponsiveSpacing = (desktop, tablet, mobile) => css`
  padding: ${desktop};

  ${media.tablet} {
    padding: ${tablet};
  }

  ${media.mobile} {
    padding: ${mobile};
  }
`;

// Helper function for responsive font sizes
export const getResponsiveFontSize = (desktop, tablet, mobile) => css`
  font-size: ${desktop};

  ${media.tablet} {
    font-size: ${tablet};
  }

  ${media.mobile} {
    font-size: ${mobile};
  }
`;

// Helper function for responsive margins
export const getResponsiveMargin = (desktop, tablet, mobile) => css`
  margin: ${desktop};

  ${media.tablet} {
    margin: ${tablet};
  }

  ${media.mobile} {
    margin: ${mobile};
  }
`;

