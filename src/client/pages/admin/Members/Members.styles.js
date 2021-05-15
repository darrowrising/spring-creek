import styled from 'styled-components';
import { theme } from 'theme';

export const Container = styled.div``;

export const ModerateContainer = styled.div`
    background-color: ${theme('color_white_1')};
    border-radius: 10px;
    margin-bottom: 40px;
    padding: 10px;
    width: 100%;
`;

export const Heading = styled.h3`
    border-bottom: 1px solid ${theme('color_grey_3')};
    font-family: ${theme('font_headers')};
`;

export const ModerateTable = styled.table`
    font-size: 1.4rem;
    width: 100%;
`;
