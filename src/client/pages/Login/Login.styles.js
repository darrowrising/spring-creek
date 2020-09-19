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
    top: 15%;
    width: 100%;
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

export const Error = styled.div`
    color: ${theme('color_error')};
    font-size: 1.2rem;
    padding-bottom: 10px;
    text-align: center;
`;

export const ForgotPasswordWrapper = styled.div`
    margin-top: 30px;
    position: relative;
    top: 15%;
`;

export const ForgotPassword = styled.span`
    color: ${theme('color_grey_1')};
    cursor: pointer;
    transition: all ${theme('transition_medium')};

    &:hover {
        color: ${lighten(0.1, theme('color_primary'))};
        text-decoration: underline;
    }
`;

export const NoAccountWrapper = styled.div`
    margin-top: 15px;
    position: relative;
    top: 15%;
`;

export const NoAccount = styled.span`
    display: inline-block;
    margin-right: 15px;
`;
