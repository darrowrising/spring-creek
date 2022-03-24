import styled from 'styled-components';
import { Button } from 'antd';
import { theme } from 'theme';

export const Title = styled.h2`
  color: ${theme('color_primary')};
  font-family: ${theme('font_brand')};
  font-size: 2rem;
  margin-top: 20px;
`;

export const Description = styled.p`
  color: ${theme('color_grey_1')};
`;

export const Label = styled.div`
  text-align: left;
`;

export const ButtonStyled = styled(Button)`
  margin-top: 40px;
  width: 125px;
`;

export const Message = styled.div`
  color: ${theme('color_primary')};
  font-family: ${theme('font_brand')};
  font-size: 1.8rem;
  padding: 40px 0;
  text-align: center;
`;

export const Sub = styled.p`
  color: ${theme('color_grey_2')};
  margin-bottom: 40px;
`;
