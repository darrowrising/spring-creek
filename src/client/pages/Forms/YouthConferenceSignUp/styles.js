import styled from 'styled-components';
import { theme } from 'theme';
import { Input, Button } from 'antd';
import { lighten } from 'polished';

const PLACEHOLDER = 'name of child';

export const Description = styled.p`
    color: ${theme('color_grey_1')};
`;

export const EventContainer = styled.div`
    display: flex;
`;

export const Label = styled.div`
    text-align: left;
`;

export const Date = styled.div`
    color: ${theme('color_grey_1')};
    font-size: 0.8rem;
    text-align: left;
`;

export const StyledInput = styled(Input).attrs({ size: 'small', allowClear: true, placeholder: PLACEHOLDER })`
    width: 100%;
`;

export const Column = styled.div`
    width: 33%;
`;

export const LastWrapper = styled.div`
    border-top: 1px solid transparent;
    display: flex;
    width: 100%;

    .overnight-input {
        width: 80%;
    }
`;

export const RemoveRowButton = styled(Button)`
    /* background-color: ${theme('color_grey_3')}; */
    border-radius: 0 6px 6px 0;
    height: 42px;
    width: 20%;

    svg {
        color: ${lighten(0.2, theme('color_red_1'))};
        height: 25px;
        width: 25px;
    }

    &:hover,
    &:active,
    &:focus {
        background-color: ${theme('color_grey_3')};
        border-color: #d9d9d9;

        svg {
            color: ${theme('color_red_1')};
        }
    }
`;

export const StyledTextArea = styled(Input.TextArea)``;
