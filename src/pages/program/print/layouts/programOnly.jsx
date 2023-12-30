import { shape } from 'prop-types';
import styled from 'styled-components';

import { Page, Space } from '../components/Page';
// import Events from '../components/Events';
import Program from '../../../../components/Program';
import FirstHalf from '../../../../components/Program/FirstHalf';
import SecondHalf from '../../../../components/Program/SecondHalf';

const StyledPage = styled(Page)`
  padding: var(--space-8);
  gap: var(--space-16);

  & > ${FirstHalf}, & > ${SecondHalf} {
    justify-content: flex-start;
    gap: var(--space-4);
  }
`;

function ProgramOnlyLayout({ data }) {
  return (
    <>
      <StyledPage>
        <FirstHalf data={data} />
        <SecondHalf data={data} />
      </StyledPage>
      <Space />
      <StyledPage>
        <FirstHalf data={data} />
        <SecondHalf data={data} />
      </StyledPage>
    </>
  );
}

ProgramOnlyLayout.propTypes = {
  data: shape(),
};

export default ProgramOnlyLayout;
