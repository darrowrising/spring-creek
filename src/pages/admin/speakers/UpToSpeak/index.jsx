import { useEffect, useState, useMemo } from 'react';
import { Table, Tabs, Modal } from 'antd';
import styled from 'styled-components';
import { arrayOf, bool, number, oneOfType, shape, string } from 'prop-types';

import Heading from '../../../../components/Heading';
import { handleState, hasData } from '../../../../utils/data.utils';
import { useAdminContext } from '../../../../providers/admin.provider';
import { filterLastSpoke, saveNote } from './utils';
import { columns, searchColumns } from './config';
import { REMOVE } from './enums';
import RemoveFromSpeaking from './Modals/RemoveFromSpeaking';
import SearchMembers from './SearchMembers';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block-end: var(--space-2);
`;

const MemberTable = ({ data, tableColumns, isLoading = false }) => (
  <Table
    dataSource={data}
    pagination={false}
    columns={tableColumns}
    loading={isLoading}
    rowKey={(record) => record.uid}
    scroll={{ x: 'max-content', y: 340 }}
    size="small"
    bordered
  />
);

MemberTable.propTypes = {
  data: arrayOf(
    shape({
      uid: oneOfType([string, number]).isRequired,
    })
  ).isRequired,
  tableColumns: arrayOf(shape({})).isRequired,
  isLoading: bool,
};

export const UpToSpeakContainer = styled.div`
  position: relative;

  .ant-tabs-extra-content {
    color: var(--color-grey-1);
  }

  & > ${Heading} {
    margin: var(--space-4) 0;
  }

  & .cell {
    min-width: 100px;
  }

  &.editable > textarea {
    padding: 0;
  }

  & tr td.editable {
    cursor: pointer;

    &:has(textarea) {
      padding: 0;
    }

    &:hover {
      background-color: #d99e3621;
    }
  }
`;

export const NotSpoken = styled.span`
  color: var(--color-warning);
`;

const INITIAL_STATE = {
  speakers: [],
  isLoading: true,
  isSearch: false,
  isError: false,
  activeTab: 'adult',
};
const MODAL_INITIAL_STATE = {
  isVisible: false,
  content: null,
  title: '',
};

const UpToSpeak = () => {
  const [state, setState] = useState(INITIAL_STATE);
  const [modalState, setModalState] = useState(MODAL_INITIAL_STATE);
  const { members } = useAdminContext();

  const { speakers = [], activeTab, isLoading } = state;

  const set = (update) => handleState(update, setState);

  const handleMoreOnClick = (record, type) => {
    switch (type) {
      case REMOVE:
        return setModalState({
          isVisible: true,
          content: <RemoveFromSpeaking record={record} toggleModal={setModalState} />,
          title: `Delay ${record?.preferredName || record.firstName} From Speaking`,
        });
      default:
        return null;
    }
  };

  const updateRecordState = (record, newState) => {
    const newSpeakers = [...speakers];

    newSpeakers.splice(record.index, 1, {
      ...record,
      ...newState,
    });

    set({
      speakers: newSpeakers,
    });
  };

  const onCellClick = (record) => {
    updateRecordState(record, { showInput: true });
  };

  const handleSaveField = (id, value) => {
    const record = speakers.find(({ uid }) => uid === id);

    updateRecordState(record, { showInput: false });
    saveNote(id, value);
  };

  const data = useMemo(() => {
    if (hasData(speakers)) {
      return filterLastSpoke(
        speakers.map((speaker, index) => ({ ...speaker, onClick: handleMoreOnClick, index })),
        activeTab
      );
    }
    return [];
  }, [speakers, activeTab]);

  const tabItems = [
    {
      key: 'adult',
      label: 'Adult',
      children: <MemberTable data={data} tableColumns={columns(onCellClick, handleSaveField)} isLoading={isLoading} />,
    },
    {
      key: 'youth',
      label: 'Youth',
      children: <MemberTable data={data} tableColumns={columns(onCellClick, handleSaveField)} />,
    },
    {
      key: 'primary',
      label: 'Primary',
      children: <MemberTable data={data} tableColumns={columns(onCellClick, handleSaveField)} />,
    },
    activeTab === 'search' && {
      key: 'search',
      label: 'Search Results',
      children: <MemberTable data={data} tableColumns={searchColumns(onCellClick, handleSaveField)} />,
    },
  ].filter(Boolean);

  useEffect(() => {
    if (activeTab === 'search') return;
    if (!hasData(members)) return;

    // Keep base list in sync with members updates without clobbering edits on click.
    set({ speakers: members, isLoading: false });
  }, [members, activeTab]);

  useEffect(() => {
    if (activeTab !== 'search') return;
    if (!hasData(members)) return;

    // When viewing search results, re-hydrate the current list from latest members.
    setState((current) => {
      const updatedSpeakers = (current.speakers ?? [])
        .map(({ uid }) => members.find((member) => member.uid === uid))
        .filter(Boolean);

      return {
        ...current,
        speakers: updatedSpeakers,
      };
    });
  }, [activeTab, members]);

  return (
    <UpToSpeakContainer>
      <Header>
        <Heading color="secondary" size="sm">
          Up to Speak
        </Heading>
        <SearchMembers set={set} />
      </Header>
      <Tabs
        defaultActiveKey={activeTab}
        activeKey={activeTab}
        type="card"
        size="small"
        onChange={(tabKey) => set({ activeTab: tabKey })}
        tabBarExtraContent={`Results ${data.length}`}
        items={tabItems}
      />
      <Modal
        title={modalState.title}
        open={modalState.isVisible}
        destroyOnHidden
        onCancel={() => setModalState({ ...modalState, isVisible: false })}
        footer={null}
      >
        {modalState.content}
      </Modal>
    </UpToSpeakContainer>
  );
};

export default UpToSpeak;
