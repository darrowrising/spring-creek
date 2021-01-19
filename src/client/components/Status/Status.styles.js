import styled from 'styled-components';
import { theme } from 'theme';

export const Container = styled.div`
    color: ${({ type }) => theme(`color_status_${type}`)};
    font-weight: bold;
    text-transform: capitalize;
`;
