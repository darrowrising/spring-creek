import styled from 'styled-components';
import theme from 'theme';

import Menu from '../../components/Menu/Menu';

export const Container = styled.div`
    animation-duration: ${theme('animation_slow')};
    animation-name: ${({ animation }) => animation || ''};
    background-color: ${theme('color_white_2')};
    display: flex;
    flex-direction: column;
    font-size: 1.6rem;
    /* height: 100%; */
    ${(props) => {
        const { animation } = props;

        if (animation) {
            return `@keyframes ${animation} ${theme(`animation_${animation}`)(props)}`;
        }
        return null;
    }}
    opacity: 1;
    position: relative;
`;

export const PageWrapper = styled.div`
    display: flex;
    height: 100%;
`;

export const Page = styled.main`
    height: 100%;
    min-height: 100vh;
    overflow-y: hidden;
    padding: 20px 32px 75px;
    width: 100%;

    /* mobile */
    @media only screen and (max-width: ${theme('mq_tablet_width')}) {
        margin-left: 0;
        padding: 20px 15px 75px;
    }
`;

export const MenuStyled = styled(Menu)`
    @media only screen and (max-width: ${theme('mq_mobile_width')}) {
        display: none;
    }
`;

export const Row = styled.div`
    background: ${theme('color_black_1')};
    display: flex;
    overflow: auto;
    width: 100%;
`;

export const Title = styled.h2``;
