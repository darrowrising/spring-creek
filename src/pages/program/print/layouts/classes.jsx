// import styled from 'styled-components';
import { shape } from 'prop-types';

import Classes from '../components/Classes';
import { Page, Space } from '../components/Page';
import Program from '../../../../components/Program';

function ClassesPrintLayout({ data }) {
  return (
    <>
      <Page>
        <Classes data={data} />
        <Program data={data} isPrint />
      </Page>
      <Space />
      <Page>
        <Classes data={data} />
        <Program data={data} isPrint />
      </Page>
    </>
  );
}

ClassesPrintLayout.propTypes = {
  data: shape(),
};

export default ClassesPrintLayout;
