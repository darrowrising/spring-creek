import { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import { theme } from 'theme';

export const GlobalStyle = createGlobalStyle`
    ${normalize()}
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    html {
        font-size: 10px;
    }

    body {
        background-color: ${theme('color_white_1')};
        color: ${theme('color_black_2')};
        font-family: ${theme('font_core')};
        -webkit-font-smoothing: antialiased;
        -moz-font-smoothing: antialiased;
        -o-font-smoothing: antialiased;
    }

    #app {
        overflow: hidden;
    }

    a {
        text-decoration: none;

        &:hover {
            text-decoration: none;
        }
    }

    /* *** Ant Design Overrides *** */
    /* Only put styles here when you don't have a variable to override for the component */
`;
