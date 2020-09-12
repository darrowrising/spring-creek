import styled from 'styled-components';
import { Select } from 'antd';
import { theme } from 'theme';
import { lighten } from 'polished';

export const Description = styled.p`
    font-size: 1.2rem;
`;

export const Wrapper = styled.div`
    display: flex;
    width: 100%;

    .center {
        text-align: center;
    }
`;

export const SelectStyled = styled(Select)`
    margin: 20px 0 40px;
    width: 200px;
`;

export const List = styled.div`
    padding-top: 20px;
    width: 100%;
`;

export const Date = styled.strong`
    display: block;
    padding: 10px 0;
    text-align: center;
`;

export const Session = styled.div`
    background-color: ${theme('color_white_1')};
    border-bottom: 1px solid ${theme('color_grey_3')};
    border-top: 1px solid ${theme('color_grey_3')};
    font-size: 1.4rem;
    padding: 10px 0;
    text-align: center;
`;

export const StatsContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
`;

export const Box = styled.div`
    background-color: ${lighten(0.1, theme('color_grey_3'))};
    border: 1px solid ${theme('color_grey_3')};
    border-radius: 5px;
    margin-left: 10px;
    padding: 20px;
    text-align: center;

    &:first-child {
        margin-left: 0;
    }
`;

export const TotalHeader = styled.h3`
    font-size: 1.5rem;
`;

export const Total = styled.div`
    color: ${theme('color_primary')};
    font-size: 3rem;
`;
