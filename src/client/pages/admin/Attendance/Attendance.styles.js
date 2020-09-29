import styled from 'styled-components';
import { theme } from 'theme';

export const Container = styled.div`
    .ant-tabs-tab {
        &:not(.ant-tabs-tab-active) {
            background: ${theme('color_grey_3')} !important;
        }
    }
    .ant-tabs-nav {
        margin: 0;
    }
`;

export const Description = styled.p`
    font-size: 1.2rem;
`;
