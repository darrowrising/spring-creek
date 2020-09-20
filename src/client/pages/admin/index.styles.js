import { createGlobalStyle } from 'styled-components';
import { normalize, darken, lighten } from 'polished';
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
        height: 100%;
    }

    body {
        background-color: ${theme('color_white_1')};
        color: ${theme('color_black_2')};
        font-family: ${theme('font_core')};
        -webkit-font-smoothing: antialiased;
        -moz-font-smoothing: antialiased;
        -o-font-smoothing: antialiased;
        height: 100%;
    }

    #app {
        height: 100%;
    }

    a {
        text-decoration: none;

        &:hover {
            text-decoration: none;
        }
    }

    /* *** Ant Design Overrides *** */
    /* Only put styles here when you don't have a variable to override for the component */
    .ant-btn-secondary {
        background-color: ${theme('color_secondary')};
        border: 1px solid ${darken(0.1, theme('color_secondary'))};
        color: ${darken(0.4, theme('color_secondary'))};

        &:hover, &:active, &:focus {
            background-color: ${lighten(0.1, theme('color_secondary'))};
            border-color: ${theme('color_secondary')};
            color: ${darken(0.4, theme('color_secondary'))};
        }
    }

    .ant-btn-tertiary {
        background-color: ${theme('color_tertiary')};
        border: 1px solid ${darken(0.1, theme('color_tertiary'))};
        color: ${theme('color_white_1')};

        &:hover, &:active, &:focus {
            background-color: ${lighten(0.1, theme('color_tertiary'))};
            border-color: ${theme('color_tertiary')};
            color: ${theme('color_white_1')};
        }
    }
`;
