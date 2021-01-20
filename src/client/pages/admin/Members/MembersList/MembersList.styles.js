import styled from 'styled-components';
import theme from 'theme';

export const Container = styled.section``;

export const Wrapper = styled.div`
    height: 560px;
`;

export const Bar = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 15px;

    button {
        margin-right: 15px;
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
