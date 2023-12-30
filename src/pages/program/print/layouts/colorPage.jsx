// import styled from 'styled-components';
import { shape } from 'prop-types';

import Cover from '../components/Cover';
import { Page, Space } from '../components/Page';
import Program from '../../../../components/Program';

function ColorPagePrintLayout({ data }) {
  return (
    <>
      <Page>
        <Cover program={data} />
        <Program data={data} isPrint />
      </Page>
      <Space />
      <Page>
        <Cover program={data} />
        <Program data={data} isPrint />
      </Page>
    </>
  );
}

ColorPagePrintLayout.propTypes = {
  data: shape(),
};

export default ColorPagePrintLayout;
