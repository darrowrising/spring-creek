import { shape } from 'prop-types';

import { Page, Space } from '../components/Page';
import Events from '../components/Events';
import Program from '../../../../components/Program';

function EventsPrintLayout({ data }) {
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
    </>
  );
}

EventsPrintLayout.propTypes = {
  data: shape(),
};

export default EventsPrintLayout;
