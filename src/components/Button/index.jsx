import { Button as AntButton } from 'antd';
import styled from 'styled-components';
import { darken, lighten } from 'polished';
import { node } from 'prop-types';

import { colorText, colorWhite1, colorPrimary, colorGreen2, colorRed1, colorOrange1 } from '../../styles/variables';

const green = colorGreen2;
const red = colorRed1;
const orange = colorOrange1;

const handleColors = (color, ghost) => {
  switch (color) {
    case 'primary':
      return {
        bg: colorPrimary,
        text: colorWhite1,
        border: darken(0.1, colorPrimary),
      };
    case 'orange': {
      return {
        bg: orange,
        text: colorWhite1,
        border: darken(0.1, orange),
      };
    }
    case 'green': {
      if (ghost) {
        return {
          bg: 'transparent',
          text: green,
          border: green,
        };
      }
      return {
        bg: green,
        text: colorWhite1,
        border: darken(0.1, green),
      };
    }
    case 'red':
      if (ghost) {
        return {
          bg: 'transparent',
          text: red,
          border: red,
        };
      }
      return {
        bg: red,
        text: colorWhite1,
        border: darken(0.1, red),
      };
    default:
      return {
        bg: colorWhite1,
        text: colorText,
        border: lighten(0.5, colorText),
      };
  }
};

const RADIUS = '6px';

const Wrapper = styled.div`
  display: inline-flex;

  button {
    border-radius: 0;
    border-right-width: 0;
    border-left-width: 0;

    &:first-child {
      border-radius: ${RADIUS} 0 0 ${RADIUS};
      border-right-width: 1px;
    }

    &:last-child {
      border-radius: 0 ${RADIUS} ${RADIUS} 0;
      border-left-width: 1px;
    }
  }
`;

export const ButtonGroup = styled(({ children, ...rest }) => <Wrapper {...rest}>{children}</Wrapper>)``;

ButtonGroup.propTypes = {
  children: node.isRequired,
};

export const ButtonRow = styled(({ children, ...rest }) => <div {...rest}>{children}</div>)`
  display: flex;
  column-gap: var(--space-4);
`;

const StyledButton = styled(AntButton)`
  &&:not(:disabled) {
    background-color: ${({ color, ghost }) => handleColors(color, ghost).bg};
    color: ${({ color, ghost }) => handleColors(color, ghost).text};
    border-color: ${({ color, ghost }) => handleColors(color, ghost).border};
  }

  &&:not(:disabled):hover {
    background-color: ${({ color, ghost }) => lighten(0.1, handleColors(color, ghost).bg)};
    color: ${({ color, ghost }) => lighten(0.1, handleColors(color, ghost).text)};
    border-color: ${({ color, ghost }) => lighten(0.1, handleColors(color, ghost).border)};
  }
`;

function Button({ children, ...rest }) {
  return <StyledButton {...rest}>{children}</StyledButton>;
}

Button.propTypes = {
  children: node.isRequired,
};

export default Button;
