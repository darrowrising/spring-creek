import styled from 'styled-components';
import theme from 'theme';

export const Container = styled.div`
    color: ${(props) => theme(`color_${props.type}`)(props)};
    text-transform: capitalize;
`;
