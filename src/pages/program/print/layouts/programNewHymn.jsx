import { shape } from 'prop-types';
import styled from 'styled-components';

import { Page, Space } from '../components/Page';
import Events from '../components/Events';
import Program from '../../../../components/Program';
import { hymns } from '../../../../configs/hymns';

const Center = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  height: 8.5in;
  width: 100%;
`;

const PDF = styled.iframe`
  border: 0;
  display: flex;
  height: 740px;
  flex-direction: column;
  width: 98%;
`;

function programNewHymn({ data }) {
  const { closing_hymn, opening_hymn, sacrament_hymn } = data;
  const { pdf } =
    [closing_hymn, opening_hymn, sacrament_hymn].flatMap((hymnNumber) =>
      hymnNumber > 1000 ? hymns.find(({ number }) => number === hymnNumber) : []
    )[0] || {};

  return (
    <>
      <Page>
        <Events data={data} />
        <Program data={data} isPrint />
      </Page>
      <Space />
      <Page>
        <Events data={data} />
        <Program data={data} isPrint />
      </Page>
      <Page style={{ padding: 0 }}>
        <Center>
          <PDF src={`${pdf}#toolbar=0&navpanes=0&view=fit&scrollbars=0&statusbar=0`} />
        </Center>
        <Center>
          <PDF src={`${pdf}#toolbar=0&navpanes=0&view=fit&scrollbars=0&statusbar=0`} />
        </Center>
      </Page>
    </>
  );
}

programNewHymn.propTypes = {
  data: shape(),
};

export default programNewHymn;
