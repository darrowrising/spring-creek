import { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import variables from './variables';

export const GlobalStyle = createGlobalStyle`
    ${normalize()}
    ${variables()}
    /* *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    body {
        overflow-y: scroll;
        background-color: var(--color-primary) !important;
        color: var(--color-text);
        font-family: var(--font-text);
        -webkit-font-smoothing: antialiased;
        -moz-font-smoothing: antialiased;
        -o-font-smoothing: antialiased;
        height: 100%;
        font-size: 1.6rem;
    }

    h1, h2, h3, h4, h5, h6 {
        margin: 0;
    }

    ul {
        margin: 0;
        padding: 0;
    }

    a {
        text-decoration: none;

        &:hover {
            text-decoration: none;
        }
    }

    mark {
        background-color: var(--color-yellow-1);
    } */
`;
