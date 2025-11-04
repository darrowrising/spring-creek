import React, { useEffect, useState, useMemo } from 'react';
import { Table, Tabs, Modal } from 'antd';
import styled from 'styled-components';

import Heading from '../../../../components/Heading';
import { handleState, hasData, isEmpty } from '../../../../utils/data.utils';
import { useAdminContext } from '../../../../providers/admin.provider';
import { filterLastPrayed, saveNote } from './utils';
import { columns, searchColumns } from './config';
import { REMOVE } from './enums';
import RemoveFromPraying from './Modals/RemoveFromPraying';
import SearchMembers from './SearchMembers';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block-end: var(--space-2);
`;

const MemberTable = ({ data, columns, isLoading = false }) => (
  <Table
    dataSource={data}
    pagination={false}
    columns={columns}
    loading={isLoading}
    rowKey={(record) => record.uid}
    scroll={{ x: 'max-content', y: 410 }}
    size="small"
    bordered
  />
);

export const UpToPrayContainer = styled.div`
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
  prayers: [],
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

const UpToPray = () => {
  const [state, setState] = useState(INITIAL_STATE);
  const [modalState, setModalState] = useState(MODAL_INITIAL_STATE);
  const { members } = useAdminContext();

  const { prayers = [], activeTab, isLoading } = state;

  const set = (update) => handleState(update, setState);

  const handleMoreOnClick = (record, type) => {
    switch (type) {
      case REMOVE:
        return setModalState({
          isVisible: true,
          content: <RemoveFromPraying record={record} toggleModal={setModalState} />,
          title: `Delay ${record?.preferredName || record.firstName} From Praying`,
        });
      default:
        return null;
    }
  };

  const updateRecordState = (record, newState) => {
    const newPrayers = [...prayers];

    newPrayers.splice(record.index, 1, {
      ...record,
      ...newState,
    });
    set({
      prayers: newPrayers,
    });
  };

  const onCellClick = (record) => {
    updateRecordState(record, { showInput: true });
  };

  const handleSaveField = (id, value) => {
    const record = prayers.find(({ uid }) => uid === id);

    updateRecordState(record, { showInput: false });
    saveNote(id, value);
  };

  const data = useMemo(() => {
    if (hasData(prayers)) {
      return filterLastPrayed(
        prayers.map((prayer, index) => ({ ...prayer, onClick: handleMoreOnClick, index })),
        activeTab
      );
    }
    return [];
  }, [prayers, activeTab]);

  const tabItems = [
    {
      key: 'adult',
      label: 'Adult',
      children: <MemberTable data={data} columns={columns(onCellClick, handleSaveField)} isLoading={isLoading} />,
    },
    {
      key: 'youth',
      label: 'Youth',
      children: <MemberTable data={data} columns={columns(onCellClick, handleSaveField)} />,
    },
    {
      key: 'primary',
      label: 'Primary',
      children: <MemberTable data={data} columns={columns(onCellClick, handleSaveField)} />,
    },
    activeTab === 'search' && {
      key: 'search',
      label: 'Search Results',
      children: <MemberTable data={data} columns={searchColumns(onCellClick, handleSaveField)} />,
    },
  ];

  useEffect(() => {
    if (activeTab === 'search') {
      const updatedPrayers = prayers.map(({ uid }) => ({ ...members.find((member) => member.uid === uid) }));
      set({ prayers: updatedPrayers });
    } else if (hasData(members)) set({ prayers: members, isLoading: false });
  }, [members]);

  return (
    <UpToPrayContainer>
      <Header>
        <Heading color="secondary" size="sm">
          Up to Pray
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
        destroyOnClose
        onCancel={() => setModalState({ ...modalState, isVisible: false })}
        footer={null}
      >
        {modalState.content}
      </Modal>
    </UpToPrayContainer>
  );
};

export default UpToPray;
