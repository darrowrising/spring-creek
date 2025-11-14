import styled from 'styled-components';
import { string } from 'prop-types';

import Link from '../Link';

const Text = styled.div`
  text-align: center;
`;

const LeadersWrapper = styled.div`
  overflow-x: hidden;
  display: flex;
  justify-content: space-between;
`;

const Dots = styled.span`
  flex-grow: 2;

  &::before {
    color: var(--color-grey-1);
    content: '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .';
    float: left;
    white-space: nowrap;
    width: 0;
  }
`;

const Value = styled.span`
  background-color: var(--color-white-1);
  padding-left: var(--space-1);
`;

const SubValueWrapper = styled.div``;

const HyperTextWrapper = styled.div`
  color: var(--color-primary);
  margin-top: -3px;
  padding-bottom: var(--space-3);
`;

const LeadersContainer = styled.div`
  ${SubValueWrapper} + &:not(${HyperTextWrapper}) {
    line-height: 1em;
    padding-bottom: 0.9em;
  }
`;

function Leaders({ title, value = '', link, subValue, helperText, ...rest }) {
  const hymnNumber = Number(value?.split('#')[1]);

  return (
    <LeadersContainer {...rest}>
      <LeadersWrapper>
        <span>{title}</span>
        <Dots />
        <Value>{value || 'TBA'}</Value>
      </LeadersWrapper>
      {subValue && (
        <SubValueWrapper>
          <Text>{subValue}</Text>
        </SubValueWrapper>
      )}
      {helperText && (
        <HyperTextWrapper className="hyper-text">
          <Text>
            {hymnNumber > 1000 ? (
              <Link
                href={
                  link ||
                  `https://www.churchofjesuschrist.org/media/music/songs/${subValue
                    .replaceAll(',', '')
                    .replaceAll(' ', '-')
                    .toLowerCase()}?lang=eng`
                }
              >
                {helperText}
              </Link>
            ) : (
              helperText
            )}
          </Text>
        </HyperTextWrapper>
      )}
    </LeadersContainer>
  );
}

Leaders.propTypes = {
  title: string,
  value: string,
  subValue: string,
  helperText: string,
};

Leaders.defaultProps = {
  subValue: '',
  title: '',
  value: 'TBA',
  helperText: '',
};

export default Leaders;
