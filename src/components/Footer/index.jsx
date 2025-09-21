import styled from 'styled-components';
import { darken } from 'polished';

import Link from '../Link';

import { colorWhite2 } from '../../styles/variables';

const FooterContainer = styled.footer`
  border-top: 1px solid ${darken(0.05, colorWhite2)};
  background-color: var(--color-white-2);
  color: var(--color-grey-1);
  padding: var(--space-3);
  text-align: center;
  line-height: 1.5em;
  font-size: 1.2rem;

  @media screen and (max-width: 600px) {
    ${Link} {
      display: block;
    }

    br {
      display: none;
    }
  }
`;

function Footer({ ...rest }) {
  return (
    <FooterContainer {...rest} className="footer">
      This is not an official website of{' '}
      <Link href="https://www.churchofjesuschrist.org">The Church of Jesus Christ of Latter-day Saints</Link>
      <br />
      This site&#39;s sole purpose is to help members and visitors of the Spring Creek Ward.
    </FooterContainer>
  );
}

export default styled(Footer)``;
