// #region imports
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { arrayOf, func, number, shape, string } from 'prop-types';
import { Form, Input, InputNumber, notification, Popconfirm, Select } from 'antd';
import { DownOutlined, MinusCircleOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { darken, lighten, rgba } from 'polished';
import { useNavigate, useParams } from 'react-router-dom';

import { useAdminContext } from '../../../providers/admin.provider';
import InfoIcon from '../../../components/InfoIcon';
import Program from '../../../components/Program';
import Button, { ButtonRow } from '../../../components/Button';
import SearchSelect from '../../../components/SearchSelect';
import { db, docs, FieldValue } from '../../../utils/firebase.utils';
import { dayjs, comingSunday, utc } from '../../../utils/date.utils';
import { useFindMember } from '../../../utils/organizations.utils';
import { hasData, uuid } from '../../../utils/data.utils';
import { createProgram } from '../../../factories/program';
import { programIdShort } from '../../../configs/dateFormats';
import {
  colorGreen1,
  colorGrey1,
  colorGrey2,
  colorOrange1,
  colorPink2,
  colorViolet1,
  colorWhite2,
  media,
} from '../../../styles/variables';
// #endregion imports

const { TextArea } = Input;
const { Option } = Select;

// #region shared
// #region styles
const Row = styled.div`
  display: flex;
  column-gap: var(--space-2);

  & > div {
    width: 100%;
  }

  ${media.tablet} {
    flex-direction: column;
    row-gap: var(--space-3);
  }
`;

const ButtonLayout = styled.div`
  text-align: right;
  transform: translate(-20px, -50px);

  ${media.tablet} {
    text-align: center;
    transform: none;
    margin-top: var(--space-3);
  }
`;
// #endregion styles
// #endregion shared
// #region Hymn
const HymnRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: flex-end;
  gap: var(--space-4);

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }

  & .hymn-label {
    text-transform: capitalize;
  }

  & .ant-input-number {
    width: 100%;
  }
`;
function Hymn({ type, form, 'data-testid': testId }) {
  const [showTitle, setShowTitle] = useState(false);

  const hymnTitle = `${type}_hymn_title`;
  const getHymn = (num) => {
    if (num) {
      db.collection('hymns')
        .where('number', '==', num)
        .get()
        .then((snap) => docs(snap)[0])
        .then(({ title }) => {
          if (num > 1000) {
            form.setFieldValue(`${type}_hymn_extra`, 'Library App/Music/Hymns-For Home and Church');
          }
          form.setFieldValue(hymnTitle, title);
          setShowTitle(true);
        });
    } else {
      form.setFieldValue(hymnTitle, '');
      setShowTitle(false);
    }
  };

  return (
    <HymnRow>
      <Form.Item className="hymn-label" label={`${type} Hymn`} name={`${type}_hymn`}>
        <InputNumber
          onBlur={({ target: { value } }) => getHymn(Number(value))}
          onPressEnter={({ target: { value } }) => getHymn(Number(value))}
          placeholder={`${type} hymn`}
          data-testid={testId}
        />
      </Form.Item>
      <Form.Item hidden name={hymnTitle}>
        <Input />
      </Form.Item>
      <Form.Item
        name={`${type}_hymn_extra`}
        label={
          showTitle && (
            <span>
              <strong>Title:</strong> <em>{form.getFieldValue(hymnTitle)}</em>
            </span>
          )
        }
      >
        <Input placeholder="extra messaging" name={`${type}_hymn_extra`} data-testid={`${testId}-extra`} />
      </Form.Item>
    </HymnRow>
  );
}

Hymn.propTypes = {
  type: string,
  form: shape(),
  'data-testid': string,
};
// #endregion Hymn

// #region BuildProgram
// #region SearchSelectProgram
function SearchSelectProgram({ label, placeholder, options, form, name, 'data-testid': testId }) {
  const [searchValue, setSearchValue] = useState('');

  const program = form.getFieldValue('program');
  const noOptions = useMemo(
    () => searchValue && !options.filter(({ value }) => value.toLowerCase().includes(searchValue.toLowerCase())).length,
    [searchValue, options]
  );
  if (noOptions) {
    return (
      <Form.Item label={label} name={[name, 'value']}>
        <Input placeholder={placeholder} autoFocus data-testid={testId} />
      </Form.Item>
    );
  }
  return (
    <Form.Item label={label} name={[name, 'value']}>
      <Select
        showSearch={{
          searchValue,
          onSearch: (value) => {
            program[name] = { ...program[name], value };
            form.setFieldValue('program', program);
            setSearchValue(value);
          },
        }}
        placeholder={placeholder}
        options={options}
        data-testid={testId}
        onInputKeyDown={({ code, target: { value } }) => {
          if (code === 'Enter') {
            program[name] = { ...program[name], value };
            form.setFieldValue('program', program);
          }
        }}
      />
    </Form.Item>
  );
}

SearchSelectProgram.propTypes = {
  label: string,
  placeholder: string,
  options: arrayOf(shape()),
  form: shape(),
  name: number,
  'data-testid': string,
};
// #endregion SearchSelectProgram
// #region Music
const PROGRAM_TYPE_OPTIONS = ['talk', 'music', 'meeting', 'hymn'];

function Music({ name }) {
  return (
    <>
      <Form.Item label="Song Title" name={[name, 'title']}>
        <Input data-testid="music-title" />
      </Form.Item>
      <Form.Item label="Performers and Accompanists" name={[name, 'value']}>
        <TextArea data-testid="music-performers" />
      </Form.Item>
    </>
  );
}

Music.propTypes = {
  name: number,
};
// #endregion music
// #region Meeting
const MEETINGS = ['Fast Sunday', 'General Conference', 'Stake Conference'];

function Meeting({ name, form }) {
  const options = MEETINGS.map((meet) => ({
    label: meet,
    value: meet,
  }));

  return (
    <>
      <span />
      <Form.Item hidden name={[name, 'title']}>
        <Input />
      </Form.Item>
      <SearchSelectProgram
        name={name}
        form={form}
        label="Meeting Name"
        placeholder="meeting name"
        options={options}
        data-testid="meeting-name"
      />
    </>
  );
}

Meeting.propTypes = {
  name: number,
  form: shape(),
};
// #endregion Meeting
// #region RestHymn
const RestHymnTitle = styled.div`
  align-self: center;
`;

function RestHymn({ name, form }) {
  const program = form.getFieldValue('program') ?? [];
  const { title } = program[name] ?? {};

  return (
    <>
      <Form.Item
        label="Hymn Number"
        name={[name, 'value']}
        onChange={({ target: { value } }) => {
          db.collection('hymns')
            .where('number', '==', Number(value))
            .get()
            .then((snap) => docs(snap)[0])
            .then(({ title: hymnTitle } = {}) => {
              program[name] = { ...program[name], value, title: hymnTitle };
              form.setFieldValue('program', program);
            });
        }}
      >
        <InputNumber data-testid="rest-hymn" />
      </Form.Item>
      <RestHymnTitle>{title === 'Speaker' ? '' : title}</RestHymnTitle>
    </>
  );
}

RestHymn.propTypes = {
  name: number,
  form: shape({
    getFieldValue: func,
    setFieldValue: func,
  }),
};
// #endregion RestHymn
// #region Talk
function Talk({ name, form }) {
  const { members } = useAdminContext();
  const options = members.map(({ displayName }) => ({ label: displayName, value: displayName }));

  return (
    <>
      <Form.Item label="Title" name={[name, 'title']} initialValue="Speaker">
        <Input data-testid={`speaker-title-${name}`} />
      </Form.Item>
      <SearchSelectProgram
        name={name}
        form={form}
        label="Name"
        placeholder="speaker"
        options={options}
        data-testid={`speaker-name-${name}`}
      />
    </>
  );
}

Talk.propTypes = {
  name: number,
  form: shape({
    getFieldValue: func,
    setFieldValue: func,
  }),
};
// #endregion Talk
// #region styles
const ProgramList = styled.div`
  background-color: ${darken(0.05, colorWhite2)};
  border-radius: var(--space-4);
  padding-top: var(--space-4);
  padding-bottom: var(--space-1);
  margin-bottom: var(--space-4);

  & > .type {
    padding: 0 var(--space-4);
  }

  .program-title {
    padding-top: var(--space-2);
  }

  & > .type-talk {
    background-color: ${rgba(colorOrange1, 0.1)};
  }

  & > .type-meeting {
    background-color: ${rgba(colorViolet1, 0.1)};
  }

  & > .type-music {
    background-color: ${rgba(colorGreen1, 0.1)};
  }

  & > .type-hymn {
    background-color: ${rgba(colorPink2, 0.1)};
  }

  .ant-form-item-control-input-content:has(button) {
    margin-top: var(--space-4);
    padding: 0 var(--space-4);
  }

  .program-title
`;

const ListRow = styled.div`
  display: grid;
  grid-template-columns: auto 100px auto 1fr auto;
  column-gap: var(--space-2);
`;

const MoveButtonsLayout = styled.div`
  display: flex;
  align-items: center;
`;

const borderColor = darken(0.1, colorGrey2);
const MoveButtons = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  box-shadow: 1px 1px 3px var(--color-grey-2);
  border: 1px solid ${borderColor};
  border-radius: var(--space-1);

  & > .anticon {
    background-color: var(--color-grey-2);
    border-top: 1px solid var(--color-grey-3);
    color: ${darken(0.1, colorGrey1)};
    padding: var(--space-1);
    transition: background-color 0.2s;

    &:hover {
      background-color: ${lighten(0.05, colorGrey2)};
    }

    &:first-child {
      border-bottom: 1px solid ${borderColor};
      border-radius: var(--space-1) var(--space-1) 0 0;
    }

    &:last-child {
      border-radius: 0 0 var(--space-1) var(--space-1);
    }
  }
`;

const StyledDownOutlined = styled(DownOutlined)`
  ${({ $disabled }) => {
    if ($disabled)
      return `
      opacity: 0.6;
      cursor: not-allowed !important;
    `;
  }}
`;

const StyledUpOutlined = styled(UpOutlined)`
  ${({ $disabled }) => {
    if ($disabled)
      return `
      opacity: 0.6;
      cursor: not-allowed !important;
    `;
  }}
`;
// #endregion styles
// #region utils
const getType = ({ form, name }) => {
  const { program = [] } = form.getFieldsValue([['program', name]]);
  const type = program.filter((v) => v)[0]?.type;
  return type;
};
// #endregion utils
// #region component
function BuildProgram({ form }) {
  const renderItem = useCallback(
    ({ name }) => {
      switch (getType({ form, name })) {
        case 'music': {
          return <Music name={name} />;
        }
        case 'meeting': {
          return <Meeting name={name} form={form} />;
        }
        case 'hymn': {
          return <RestHymn name={name} form={form} />;
        }
        default: {
          return <Talk name={name} form={form} />;
        }
      }
    },
    [form]
  );

  return (
    <ProgramList>
      <Form.List name="program">
        {(fields, { add, remove, move }) => (
          <>
            {fields.map(({ name }) => (
              <div key={`program-item-${name + 1}`} className={`type type-${getType({ form, name })}`}>
                <h4 className="program-title">Program Item {name + 1}</h4>
                <ListRow>
                  <MoveButtonsLayout>
                    <MoveButtons>
                      <StyledUpOutlined $disabled={name === 0} onClick={() => move(name, name - 1)} />
                      <StyledDownOutlined $disabled={name === fields.length - 1} onClick={() => move(name, name + 1)} />
                    </MoveButtons>
                  </MoveButtonsLayout>
                  <Form.Item label="Item Type" name={[name, 'type']} initialValue="talk">
                    <Select
                      data-testid={`program-type-${name}`}
                      onSelect={(type) => {
                        const program = form.getFieldValue('program');
                        program[name] = { ...program[name], type };
                        form.setFieldValue('program', program);
                      }}
                    >
                      {PROGRAM_TYPE_OPTIONS.map((option) => (
                        <Option key={`${option}-${name + 1}`} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {renderItem({ name })}
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </ListRow>
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </ProgramList>
  );
}

BuildProgram.propTypes = {
  form: shape({
    getFieldValue: func,
    setFieldValue: func,
  }),
};
// #endregion component
// #endregion BuildProgram

// #region MakeProgram
// #region styles
const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const ProgramLayout = styled.div`
  background-color: var(--color-white-1);
  border: 1px solid var(--color-grey-3);
  border-radius: var(--space-2);
  padding: var(--space-6);

  ${media.mobile} {
    display: none;
  }
`;
// #endregion styles

let unsubscribe;

// #region enums
const CALLINGS = {
  conducting: ['Bishop', 'Bishopric First Counselor', 'Bishopric Second Counselor'],
  chorister: ['Chorister'],
  organist: ['Accompanist'],
};
const PRINT_LAYOUTS = ['events', 'programOnly', 'programNewHymn', 'colorPage', 'classes'];
const TOPICS = [
  ...MEETINGS,
  'High Council',
  'Ward Conference',
  'Primary Program',
  'Easter Program',
  'Christmas Program',
].map((item) => ({ label: item, value: item }));
const INITIAL_DROPDOWN_STATE = {
  conductingOptions: [],
  choristerOptions: [],
  organistOptions: [],
};
// #endregion enums
// #region utils
const saveMember = ({ uid, ...rest }) => {
  if (uid) {
    db.collection('members')
      .doc(uid)
      .update({
        uid,
        ...rest,
      });
  }
};
const handleMembersInProgram = ({ findMember, program, prevProgram = [], date }) => {
  program.forEach(({ memberUid, value }, index) => {
    if (memberUid) {
      const prevMember = findMember({ name: prevProgram[index]?.value });

      if (prevMember?.displayName && prevMember?.displayName !== value) {
        const format = 'MMDDYY';
        const prevSpeakingDates = prevMember.speakingHistory?.map((prevDate) => utc({ date: prevDate, format })) ?? [];
        const currDate = utc({ date, format });
        const dateIndex = prevSpeakingDates.findIndex((d) => d === currDate);
        const removeDate = prevMember.speakingHistory[dateIndex];

        if (removeDate)
          saveMember({
            uid: prevMember.uid,
            speakingHistory: FieldValue().arrayRemove(removeDate),
          });
      }

      saveMember({
        uid: memberUid,
        speakingHistory: FieldValue().arrayUnion(date),
      });
    }
  });
};

const handlePrayingHistory = ({ current, prev, findMember }) => {
  const comparePrayingHistory = ({ type, date, currentName = '', prevName = '', memberFinder }) => {
    if (!date) return;

    const historyEntry = { date, type };

    // If the previous assignment existed and changed, remove the history from the previous member.
    if (prevName && prevName !== currentName) {
      const prevMember = memberFinder?.({ name: prevName });

      if (prevMember?.uid) {
        saveMember({
          uid: prevMember.uid,
          prayingHistory: FieldValue().arrayRemove(historyEntry),
        });
      }
    }

    // If the current assignment exists and changed, add the history to the current member.
    if (currentName && currentName !== prevName) {
      const currentMember = memberFinder?.({ name: currentName });

      if (currentMember?.uid) {
        saveMember({
          uid: currentMember.uid,
          prayingHistory: hasData(currentMember.prayingHistory)
            ? FieldValue().arrayUnion(historyEntry)
            : [historyEntry],
        });
      }
    }
  };

  const date = prev?.date || current?.date;

  comparePrayingHistory({
    type: 'invocation',
    date,
    currentName: current?.invocation ?? '',
    prevName: prev?.invocation ?? '',
    memberFinder: findMember,
  });

  comparePrayingHistory({
    type: 'benediction',
    date,
    currentName: current?.benediction ?? '',
    prevName: prev?.benediction ?? '',
    memberFinder: findMember,
  });
};
// #endregion utils
// #region component
function MakeProgram() {
  const [dropdowns, setDropdowns] = useState(INITIAL_DROPDOWN_STATE);
  const [dbData, setDbData] = useState({});
  // const [date, setDate] = useState(() => utc({ date: comingSunday() }));
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  const store = Form.useWatch([], form) ?? {};
  const { members } = useAdminContext();

  const { topic } = store;
  const { setFieldsValue, setFieldValue, getFieldsValue } = form;
  const findMember = useFindMember(members);
  const findMemberRef = useRef(findMember);
  const memberOptions = useMemo(() => members.map(({ displayName }) => displayName), [members]);

  useEffect(() => {
    findMemberRef.current = findMember;
  }, [findMember]);

  const fieldOptions = (field) => {
    const fieldValue = form.getFieldValue(field);
    const dropdown = dropdowns[`${field}Options`];

    const isOption = fieldValue === '' || dropdown.includes(fieldValue);

    return isOption ? dropdown : memberOptions;
  };

  const onFinish = (data = {}) => {
    const { uid: programUid } = dbData;
    const newData = { ...data };

    newData.program = data.program.map(({ uid, ...rest }, index) => ({ ...rest, priority: index, uid: uid || uuid() }));
    newData.date = utc({ date: comingSunday() });

    const programData = createProgram(newData);

    handlePrayingHistory({ current: programData, prev: dbData, findMember });

    programData.program = programData.program.map((item = '') => {
      const { type } = item;

      if (type === 'talk') {
        const { uid } = findMember({ name: item.value }) || {};

        if (uid) {
          return {
            ...item,
            memberUid: uid,
          };
        }
        return item;
      }

      return item;
    });

    if (id) {
      programData.date = dayjs(id, programIdShort).hour(9).format();
      programData.id = id;
      programData.year = dayjs(id, programIdShort).format('YYYY');
    }

    if (programUid)
      try {
        db.collection('program')
          .doc(programUid)
          .update({ ...programData, uid: programUid })
          .then(() => {
            handleMembersInProgram({
              program: programData.program,
              prevProgram: dbData.program,
              findMember,
              date: programData.date,
            });
            notification.success({
              message: 'Program has been saved',
            });
          });
      } catch (error) {
        console.error('error update', error);
        notification.error({
          message: 'Unable to Save',
          description: 'Due to bad data. Check the form and try again',
        });
      }
    else
      try {
        db.collection('program')
          .doc(programData.uid)
          .set(programData)
          .then(() => {
            handleMembersInProgram({
              program: programData.program,
              prevProgram: dbData.program,
              findMember,
              date: programData.date,
            });
            notification.success({
              message: 'Program has been saved',
            });
          });
      } catch (error) {
        console.error('error new', error);
        notification.error({
          message: 'Unable to Save',
          description: 'Due to bad data. Check the form and try again.',
        });
      }
  };

  const onFinishFailed = () => {
    notification.error({
      message: 'Unable to Save',
      description: 'Make sure required fields are filled in',
    });
  };

  const onDelete = async () => {
    const { uid } = getFieldsValue(true);

    await db
      .collection('program')
      .doc(uid)
      .delete()
      .then(() => {
        dbData.program?.forEach(({ memberUid }) => {
          if (memberUid) {
            saveMember({
              uid: memberUid,
              speakingHistory: FieldValue().arrayRemove(dbData.date),
              prayingHistory: FieldValue().arrayRemove(dbData.date),
            });
          }
        });
        notification.info({
          message: 'Program has been deleted',
        });
      });
  };

  useEffect(() => {
    const programId = id ?? utc({ date: comingSunday(), format: programIdShort });

    if (hasData(members)) {
      unsubscribe = db
        .collection('program')
        .where('id', '==', programId)
        .onSnapshot((programSnap) => {
          const data = docs(programSnap)[0] ?? {};

          const findMembersWithCallings = (callings) =>
            findMemberRef.current({ callings }).map(({ displayName, callings: memberCallings }) => {
              if (memberCallings.includes('Bishop')) return `Bishop ${displayName}`;
              return displayName;
            });

          setDropdowns({
            conductingOptions: findMembersWithCallings(CALLINGS.conducting),
            choristerOptions: findMembersWithCallings(CALLINGS.chorister),
            organistOptions: findMembersWithCallings(CALLINGS.organist),
          });

          setDbData(data ?? {});

          setFieldsValue({
            ...createProgram(),
            presiding: `Bishop ${findMemberRef.current({ calling: 'Bishop' })?.displayName}`,
            program: (data.program || [{ type: 'talk', title: 'Speaker' }]).sort((a, b) => a.priority - b.priority),
            ...data,
          });
        });

      return () => unsubscribe();
    }
  }, [members, id, setDropdowns, setDbData, setFieldsValue]);

  useEffect(() => {
    if (topic === 'Fast Sunday') {
      setFieldValue('program', [
        {
          type: 'meeting',
          title: '',
          value: 'Bearing of Testimonies',
          priority: 0,
        },
      ]);
    }
  }, [topic, setFieldValue]);

  return (
    <>
      <ButtonLayout className="print-button">
        <Button htmlType="button" onClick={() => navigate('/program/print')}>
          To Print Page
        </Button>
      </ButtonLayout>
      <Layout>
        <Form
          name="program-builder"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          preserve
          form={form}
        >
          <Row>
            <Form.Item
              label="Print Layout"
              name="print_layout"
              rules={[
                {
                  required: true,
                  message: 'Please pick a print layout',
                },
              ]}
            >
              <Select placeholder="print layout" data-testid="print-layout">
                {PRINT_LAYOUTS.map((layout) => (
                  <Option key={`print-layout-${layout}`} value={layout}>
                    {layout}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <SearchSelect label="Topic" name="topic" options={TOPICS} form={form} data-testid="topic" />
          </Row>
          <Row>
            <Form.Item label="Presiding" name="presiding">
              <Input />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Conducting <InfoIcon text={`Callings for dropdown: ${CALLINGS.conducting.join(', ')}`} />
                </span>
              }
              name="conducting"
            >
              <Select
                showSearch={{
                  onSearch: (value) => {
                    form.setFieldValue('conducting', value);
                  },
                }}
                placeholder="who's conducting?"
                data-testid="conducting"
                onBlur={({ target: { value } }) => {
                  if (value) form.setFieldValue('conducting', value);
                }}
                onInputKeyDown={({ code, target: { value } }) => {
                  if (code === 'Enter') form.setFieldValue('conducting', value);
                }}
              >
                {fieldOptions('conducting').map((conductor) => (
                  <Option key={`conductor-${conductor}`} value={conductor}>
                    {conductor}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item
              label={
                <span>
                  Chorister <InfoIcon text={`Callings for dropdown: ${CALLINGS.chorister.join(', ')}`} />
                </span>
              }
              name="chorister"
            >
              <Select
                showSearch={{
                  onSearch: (value) => {
                    form.setFieldValue('chorister', value);
                  },
                }}
                placeholder="who's leading the music?"
                data-testid="chorister"
                onBlur={({ target: { value } }) => {
                  if (value) form.setFieldValue('chorister', value);
                }}
                onInputKeyDown={({ code, target: { value } }) => {
                  if (code === 'Enter') form.setFieldValue('chorister', value);
                }}
              >
                {fieldOptions('chorister').map((leadingMusic) => (
                  <Option key={`chorister-${leadingMusic}`} value={leadingMusic}>
                    {leadingMusic}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Organist <InfoIcon text={`Callings for dropdown: ${CALLINGS.organist.join(', ')}`} />
                </span>
              }
              name="organist"
            >
              <Select
                showSearch={{
                  onSearch: (value) => {
                    form.setFieldValue('organist', value);
                  },
                }}
                placeholder="who's organist?"
                data-testid="organist"
                onBlur={({ target: { value } }) => {
                  if (value) form.setFieldValue('organist', value);
                }}
                onInputKeyDown={({ code, target: { value } }) => {
                  if (code === 'Enter') form.setFieldValue('organist', value);
                }}
              >
                {fieldOptions('organist').map((organist) => (
                  <Option key={`organist-${organist}`} value={organist}>
                    {organist}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Row>
          <Hymn type="opening" form={form} data-testid="opening-hymn" />
          <Form.Item label="Invocation" name="invocation">
            <Select
              showSearch
              placeholder="opening"
              data-testid="invocation"
              onBlur={({ target: { value } }) => {
                if (value) form.setFieldValue('invocation', value);
              }}
              onInputKeyDown={({ code, target: { value } }) => {
                if (code === 'Enter') form.setFieldValue('invocation', value);
              }}
            >
              {members.map(({ displayName, uid }) => (
                <Option key={`member-${uid}`} value={displayName}>
                  {displayName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Hymn type="sacrament" form={form} data-testid="sacrament-hymn" />
          <BuildProgram form={form} />
          <Hymn type="closing" form={form} data-testid="closing-hymn" />
          <Form.Item label="Benediction" name="benediction">
            <Select
              showSearch
              placeholder="closing"
              data-testid="benediction"
              onBlur={({ target: { value } }) => {
                if (value) form.setFieldValue('benediction', value);
              }}
              onInputKeyDown={({ code, target: { value } }) => {
                if (code === 'Enter') form.setFieldValue('benediction', value);
              }}
            >
              {members.map(({ displayName, uid }) => (
                <Option key={uid} value={displayName}>
                  {displayName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Event Page Note" name="note">
            <TextArea placeholder="Program Note" />
          </Form.Item>
          <Form.Item>
            <ButtonRow>
              <Button color="primary" htmlType="submit">
                Save
              </Button>
              <Button htmlType="reset" onClick={() => form.resetFields()}>
                Reset
              </Button>
              <Popconfirm
                title="Delete this program"
                description="Are you sure to delete this program?"
                onConfirm={onDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button color="red">Delete</Button>
              </Popconfirm>
            </ButtonRow>
          </Form.Item>
        </Form>
        <ProgramLayout>
          <Program data={store} />
        </ProgramLayout>
      </Layout>
    </>
  );
}

export default MakeProgram;
// #endregion component
// #endregion MakeProgram
