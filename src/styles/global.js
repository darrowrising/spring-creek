import { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import variables from './variables';

export const GlobalStyle = createGlobalStyle`
    ${normalize()}
    ${variables()}
    
    /* Responsive viewport */
    html {
      font-size: 10px;
      
      @media (max-width: 768px) {
        font-size: 9px;
      }
      
      @media (max-width: 480px) {
        font-size: 8px;
      }
    }
    
    /* Ensure proper box sizing */
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    
    /* Responsive body styles */
    body {
      overflow-y: scroll;
      background-color: var(--color-primary);
      color: var(--color-text);
      font-family: var(--font-text);
      -webkit-font-smoothing: antialiased;
      -moz-font-smoothing: antialiased;
      -o-font-smoothing: antialiased;
      height: 100%;
      font-size: 1.6rem;
      
      @media (max-width: 768px) {
        font-size: 1.4rem;
      }
    }
    
    /* Responsive headings */
    h1, h2, h3, h4, h5, h6 {
      margin: 0;
      
      @media (max-width: 768px) {
        word-wrap: break-word;
      }
    }
    
    /* Responsive lists */
    ul {
      margin: 0;
      padding: 0;
    }
    
    /* Responsive links */
    a {
      text-decoration: none;
      
      &:hover {
        text-decoration: none;
      }
    }
    
    /* Responsive mark */
    mark {
      background-color: var(--color-yellow-1);
    }
    
    /* Responsive tables */
    .ant-table {
      @media (max-width: 768px) {
        font-size: 1.2rem;
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }
    }
    
    /* Responsive forms */
    .ant-form {
      @media (max-width: 768px) {
        .ant-form-item {
          margin-bottom: var(--space-3);
        }
      }
    }
    
    /* Responsive modals */
    .ant-modal {
      @media (max-width: 768px) {
        margin: var(--space-2);
        max-width: calc(100vw - var(--space-4));
      }
    }
    
    /* Responsive buttons */
    .ant-btn {
      @media (max-width: 768px) {
        height: 36px;
        padding: 4px 12px;
        font-size: 1.4rem;
      }
    }

    /* Keep dense table/action small buttons compact on mobile */
    .ant-btn-sm {
      @media (max-width: 768px) {
        height: auto;
        min-height: 24px;
        padding: 0 8px;
        font-size: 1.2rem;
        line-height: 1.4;
      }
    }
    
    /* Mobile Safari: prevent zoom on form focus by ensuring >= 16px */
    @media (max-width: 768px) {
      input,
      textarea,
      select,
      .ant-input,
      .ant-input-affix-wrapper input,
      .ant-input-number-input,
      .ant-picker-input > input,
      .ant-select-selector,
      .ant-select-selection-search-input {
        font-size: 16px !important;
      }

      .ant-input {
        height: 36px;
      }

      /*
        Dense admin tables: keep every column (text, notes, selects, inputs)
        on the same rem scale as .ant-table, not the 16px/36px form rules.
      */
      .ant-table,
      .ant-table th,
      .ant-table td {
        font-size: 1.2rem;
        line-height: 1.4;
      }

      .ant-table .ant-input,
      .ant-table textarea,
      .ant-table textarea.ant-input,
      .ant-table .ant-input-affix-wrapper,
      .ant-table .ant-input-affix-wrapper input,
      .ant-table .ant-input-textarea-affix-wrapper,
      .ant-table .ant-select-selector,
      .ant-table .ant-select-selection-item,
      .ant-table .ant-select-selection-search-input,
      .ant-table .note-input,
      .ant-table .note-input .ant-input,
      .ant-table .note-input textarea.ant-input {
        font-size: 1.2rem !important;
        height: auto !important;
        min-height: 0 !important;
        line-height: 1.4 !important;
      }

      .ant-table .ant-btn {
        font-size: 1.2rem;
      }

      .ant-table .ant-btn-sm {
        height: auto;
        min-height: 24px;
        padding: 0 8px;
      }
    }
    
    /* Responsive tabs */
    .ant-tabs {
      @media (max-width: 768px) {
        .ant-tabs-tab {
          padding: var(--space-2) var(--space-3);
          font-size: 1.3rem;
        }
      }
    }
    
    /* Print styles */
    @media print {
      body {
        background-color: transparent;
        color: var(--color-black-1);

        .header,
        .footer {
          display: none;
        }

        .admin-body {
          grid-template-columns: 1fr;

          .heading,
          .menu {
            display: none;
          }
        }

        .print-button {
          display: none;
        }

        #conductingPage {
          height: 10.5in;
        }

        main {
          background-color: white !important;
          height: 100vh;
        }
      }
    }
`;
