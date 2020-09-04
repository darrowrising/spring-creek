import styled from 'styled-components';
import { theme } from 'theme';

export const Container = styled.header`
    background-color: ${theme('color_blue_1')};
    color: ${theme('color_white_2')};
    font-size: 80%;
    padding: 5px 30px;
    transition: all 0.5s ease;

    @media screen and (max-width: 600px) {
        padding: 5px 10px;
    }
`;

export const Logo = styled.div`
    color: ${theme('color_white_2')};
    display: inline-block;
    font-family: ${theme('color_font_brand')};
    margin: 0;
    transition: color 0.3s ease;

    &:hover {
        color: ${theme('color_white_1')};
    }
`;
