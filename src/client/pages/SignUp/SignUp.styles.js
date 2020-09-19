import styled from 'styled-components';
import { Button as AntButton } from 'antd';
import { theme } from 'theme';
import { lighten } from 'polished';

export const Container = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;

    .ant-form-item {
        &:last-child {
            margin-bottom: 0 !important;

            .ant-form-item-children {
                display: flex;
                justify-content: flex-end;
                width: 100%;
            }
        }
    }
`;

export const Wrapper = styled.div`
    border: 1px solid ${lighten(0.6, theme('color_primary'))};
    border-radius: 10px;
    box-shadow: 0 0px 20px ${lighten(0.5, theme('color_primary'))};
    max-width: 500px;
    padding: 60px;
    position: relative;
    top: 5%;
    width: 100%;

    @media screen and (max-width: ${theme('mq_mobile_width')}) {
        top: 0;
    }
`;

export const Title = styled.h2`
    margin-top: -20px;
    padding-bottom: 20px;
`;

export const Button = styled(AntButton)`
    &.ant-btn-background-ghost {
        && {
            &:hover {
                background-color: ${lighten(0.2, theme('color_secondary'))} !important;
            }
        }
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    margin-top: 20px;
`;
