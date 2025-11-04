import React, { useState } from 'react';
import { shape, func } from 'prop-types';
import { Select, Input, Button } from 'antd';
// configs
import { DELAY_TIMES_OPTIONS } from './config';
// utils
import { saveMember } from './utils';
// styles
import { StyleHeading, Row, ButtonGroup } from '../../../../speakers/UpToSpeak/Modals/styles';

const { Option } = Select;
const { TextArea } = Input;

const RemoveFromPraying = ({ record, toggleModal }) => {
  const [prayingDelay, setPrayingDelay] = useState(null);
  const [reason, setReason] = useState(null);

  const handleOnSave = async () => {
    await saveMember(prayingDelay, reason, record);

    setPrayingDelay(null);
    setReason(null);
    toggleModal(false);
  };

  return (
    <>
      <Row>
        <StyleHeading as="h4">For How Long:</StyleHeading>
        <Select onChange={(delay) => setPrayingDelay(delay)}>
          {DELAY_TIMES_OPTIONS.map(({ display, months }) => (
            <Option key={display} value={months}>
              {display}
            </Option>
          ))}
        </Select>
      </Row>
      <Row>
        <StyleHeading as="h4">Reason:</StyleHeading>
        <TextArea rows={2} onChange={({ target: { value } }) => setReason(value)} />
      </Row>
      <ButtonGroup>
        <Button onClick={() => toggleModal(false)}>Cancel</Button>
        <Button disabled={!prayingDelay || !reason} type="primary" onClick={handleOnSave}>
          Save
        </Button>
      </ButtonGroup>
    </>
  );
};

RemoveFromPraying.propTypes = {
  record: shape(),
  toggleModal: func,
};

RemoveFromPraying.defaultProps = {
  record: {},
  toggleModal: null,
};

export default RemoveFromPraying;
