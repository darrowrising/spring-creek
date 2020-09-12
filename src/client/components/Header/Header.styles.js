import styled from 'styled-components';
import { theme } from 'theme';

export const Container = styled.header`
    background-color: ${theme('color_primary_admin')};
    color: ${theme('color_white_2')};
    padding: 5px 30px;
    transition: all 0.5s ease;

    @media screen and (max-width: 600px) {
        padding: 5px 10px;
    }
`;

export const Logo = styled.div`
    color: ${theme('color_white_2')};
    display: inline-block;
    font-family: ${theme('font_brand')};
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
    transition: color 0.3s ease;

    &:hover {
        color: ${theme('color_white_1')};
    }
`;
