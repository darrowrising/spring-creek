import styled from 'styled-components';
import theme from 'theme';
import { lighten } from 'polished';

export const Container = styled.section``;

export const Wrapper = styled.div`
    height: 560px;
    overflow: scroll;

    .row-odd {
        background-color: ${(props) => lighten(0.03, theme('color_grey_3')(props))};

        & td:first-child {
            background-color: ${(props) => lighten(0.03, theme('color_grey_3')(props))};
        }
    }
`;

export const Bar = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 15px;

    button {
        margin-right: 15px;
    }

    .left {
        margin-right: auto;
    }
`;

export const StatusColor = styled.span`
    color: ${(props) => {
        const { status } = props;
        if (status === 'deactivated') return `${theme('color_danger')(props)}`;
        if (status === 'activated') return `${theme('color_success')(props)}`;
        return 'inherit';
    }};
`;
