import styled from 'styled-components';
import { theme } from 'theme';

export const TotalRow = styled.div`
    display: flex;
    margin-bottom: 40px;
`;

export const TotalColumn = styled.div`
    background-color: ${theme('color_grey_3')};
    border-radius: 6px;
    height: 140px;
    margin-right: 10px;
    padding: 20px;
    text-align: center;
`;

export const Total = styled.span`
    color: ${theme('color_primary')};
    font-family: ${theme('font-brand')};
    font-size: 4rem;
    font-weight: 800;
`;

export const Title = styled.h3`
    font-size: 1.8rem;
    font-weight: 300;
`;
