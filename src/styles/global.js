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
    
    /* Responsive inputs */
    .ant-input {
      @media (max-width: 768px) {
        height: 36px;
        font-size: 1.4rem;
      }
    }
    
    /* Responsive selects */
    .ant-select {
      @media (max-width: 768px) {
        font-size: 1.4rem;
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
