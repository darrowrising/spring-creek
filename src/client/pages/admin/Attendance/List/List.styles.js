import styled from 'styled-components';
import { theme } from 'theme';
import { lighten, rgba } from 'polished';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { Select } from 'antd';

export const Container = styled.div`
    padding: 20px;

    @media screen and (max-width: ${theme('mq_mobile_width')}) {
        .table-attendees {
            margin-left: -27px !important;
            padding-left: 0 !important;
        }
    }
`;

export const SelectStyled = styled(Select)`
    margin: 20px 0 40px;
    width: 200px;
`;

export const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    max-width: 800px;

    .center {
        text-align: center;
    }
`;

export const List = styled.div`
    padding-top: 20px;
    width: 100%;
`;

// export const Date = styled.strong`
//     display: block;
//     padding: 10px 0;
//     text-align: center;
// `;

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
    padding-bottom: 20px;
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

    @media screen and (max-width: ${theme('mq_mobile_width')}) {
        font-size: 1.2rem;
    }
`;

export const Total = styled.div`
    color: ${({ limit }) => (limit ? theme('color_danger') : theme('color_primary'))};
    font-size: 3rem;
    position: relative;

    .edit-total {
        bottom: -10px;
        color: ${theme('color_green_2')};
        font-size: 2rem;
        opacity: 1;
        position: absolute;
        right: -10px;
        transition: opacity ${theme('transition_medium')};

        &:hover {
            opacity: 0.6;
        }
    }

    @media screen and (max-width: ${theme('mq_mobile_width')}) {
        font-size: 2.5rem;
    }
`;

export const ButtonWrapper = styled.div``;

const defaultIcon = (icon) => styled(icon)`
    border: 1px solid ${theme('color_white_1')};
    border-radius: 5px;
    padding: 5px;
    transition: all ${theme('transition_medium')};

    &:hover {
        opacity: 0.8;
    }
`;

export const EditIcon = styled(defaultIcon(EditFilled))`
    color: ${theme('color_grey_1')};
`;

export const DeleteIcon = styled(defaultIcon(DeleteFilled))`
    color: ${theme('color_danger')};

    &:hover {
        border-color: ${rgba(theme('color_danger'), 0.5)};
    }
`;

/* Config Styles */
export const ConfirmMessage = styled.div`
    margin-bottom: 10px;
`;

export const Reason = styled.div`
    font-weight: bold;
`;
