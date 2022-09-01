import React, { useState } from 'react';
import { shape, func } from 'prop-types';
import { DatePicker, Select, Button } from 'antd';
// configs
import { dateShort } from '../../../../../../../configs/dateFormats.configs';
// utils
import { utc } from '../../../../../../utils/date.utils';
import { saveMember, saveProgram } from './utils';
// styles
import { StyleHeading, Row, ButtonGroup } from '../styles';

const { Option } = Select;
const numberOfSpeakers = Array(7)
  .fill('')
  .map((x, index) => index + 1);

const SetToSpeak = ({ record, toggleModal }) => {
  const [date, setDate] = useState('');
  const [position, setPosition] = useState(1);

  const handleOnSave = async () => {
    await saveProgram(date, position, record);
    await saveMember(date, record);

    setPosition(1);
    setDate('');
    toggleModal(false);
  };

  return (
    <div>
      <Row>
        <div>
          <StyleHeading as="h4">Date</StyleHeading>
          <DatePicker
            format={dateShort}
            onChange={(newDate) => {
              setDate(utc(newDate));
            }}
          />
        </div>
        <div>
          <StyleHeading as="h4">Position To Speak</StyleHeading>
          <Select style={{ width: 100 }} defaultValue={1} onChange={(x) => setPosition(x)}>
            {numberOfSpeakers.map((num) => (
              <Option key={`speakers-${num}`} value={num}>
                {num}
              </Option>
            ))}
          </Select>
        </div>
      </Row>
      <ButtonGroup>
        <Button onClick={() => toggleModal(false)}>Cancel</Button>
        <Button disabled={!date} type="primary" onClick={handleOnSave}>
          Save
        </Button>
      </ButtonGroup>
    </div>
  );
};

SetToSpeak.propTypes = {
  record: shape(),
  toggleModal: func,
};

SetToSpeak.defaultProps = {
  record: {},
  toggleModal: null,
};

export default SetToSpeak;
