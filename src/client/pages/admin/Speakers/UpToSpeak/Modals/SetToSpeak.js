import React, { useState } from 'react';
import { shape } from 'prop-types';
import { DatePicker, Select, Button } from 'antd';
// configs
import { dateShort } from '../../../../../../configs/dateFormats.configs';
// utils
import { utc } from '../../../../../utils/date.utils';
// styles
import { Container, StyleHeading, ButtonGroup } from './styles';

const { Option } = Select;
const numberOfSpeakers = Array(7)
  .fill('')
  .map((x, index) => index + 1);

const SetToSpeak = ({ record }) => {
  const [date, setDate] = useState('');
  const [position, setPosition] = useState(1);
  console.log('record', record);
  console.log('position', position);
  return (
    <Container>
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
      <ButtonGroup>
        <Button>Cancel</Button>
        <Button disable={!date}>Save</Button>
      </ButtonGroup>
    </Container>
  );
};

SetToSpeak.propTypes = {
  record: shape(),
};

SetToSpeak.defaultProps = {
  record: {},
};

export default SetToSpeak;
