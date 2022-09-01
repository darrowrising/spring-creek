import React, { useEffect, useState } from 'react';
import { notification, Table, Tabs, Modal } from 'antd';
// components
import Heading from '../../../../components/Heading';
import SetToSpeak from './Modals/SetToSpeak';
import RemoveFromSpeaking from './Modals/RemoveFromSpeaking';
import SearchMembers from './SearchMembers';
// utils
import { fetchWhoSpokeLast, unsubscribe, fetchMembers, saveNote } from './utils';
import { handleState } from '../../../../utils/state.utils';
// configs
import { columns, searchColumns } from './config';
import { SET_TO_SPEAK, REMOVE } from './enums';
// styles
import { UpToSpeakContainer } from './styles';

const initialState = {
  speakers: [],
  isLoading: false,
  isSearch: false,
  isError: false,
};
const modalInitialState = {
  isVisible: false,
  content: null,
  title: '',
};
const { TabPane } = Tabs;

const UpToSpeak = () => {
  // hooks
  const [state, setState] = useState(initialState);
  const [activeTab, setActiveTab] = useState('adult');
  const [modalState, setModalState] = useState(modalInitialState);
  // data
  const { speakers = [], isLoading, isSearch, isError } = state;

  const set = (update) => handleState(update, setState);
  const handleMoreOnClick = (record, type) => {
    switch (type) {
      case SET_TO_SPEAK:
        return setModalState({
          isVisible: true,
          content: <SetToSpeak record={record} toggleModal={setModalState} />,
          title: `Set ${record?.preferredName || record.firstName} to Speak on:`,
        });
      case REMOVE:
        return setModalState({
          isVisible: true,
          content: <RemoveFromSpeaking record={record} toggleModal={setModalState} />,
          title: `Remove ${record?.preferredName || record.firstName} From The Speaking Schedule`,
        });
      default:
        return null;
    }
  };
  const onCellClick = (record) => {
    const memberIndex = speakers.findIndex((member) => member.uid === record.uid);
    const newSpeakers = [...speakers];

    newSpeakers.splice(memberIndex, 1, {
      ...record,
      speakingNote: {
        showInput: true,
        ...record,
      },
    });

    set({
      speakers: newSpeakers,
    });
  };
  const handleSaveField = (id, value) => {
    const memberRecord = speakers.find(({ uid }) => uid === id);

    if (!value && memberRecord.speakingNote.speakingNote === value) {
      const memberIndex = speakers.findIndex(({ uid }) => uid === id);
      const newSpeakers = [...speakers];

      newSpeakers.splice(memberIndex, 1, {
        ...memberRecord,
        speakingNote: '',
      });

      return set({
        speakers: newSpeakers,
      });
    }

    saveNote(id, value);
  };
  const handleClearSearch = () => {
    setActiveTab('adult');
    set({ isSearch: false });
  };

  const data = speakers.map((speaker) => ({ ...speaker, onClick: handleMoreOnClick }));

  useEffect(() => {
    if (activeTab !== 'delay') {
      fetchWhoSpokeLast(set, activeTab);
      return () => unsubscribe();
    }
  }, [activeTab]);

  useEffect(() => {
    if (isSearch && activeTab !== 'delay') setActiveTab('delay');
  }, [isSearch]);

  useEffect(() => {
    if (isError)
      return notification.error({
        message: 'OH NO!',
        description: 'We could not find the list of people to speak',
      });
  }, [isError]);

  return (
    <UpToSpeakContainer>
      <Heading secondary>Up to Speak</Heading>
      <SearchMembers onClear={handleClearSearch} onSearch={(searchValue) => fetchMembers(set, searchValue)} />
      <Tabs
        defaultActiveKey={activeTab}
        activeKey={activeTab}
        type="card"
        size="small"
        onChange={(tabKey) => setActiveTab(tabKey)}
      >
        <TabPane tab="Adult" key="adult">
          <Table
            dataSource={data}
            pagination={false}
            columns={columns(onCellClick, handleSaveField)}
            loading={isLoading}
            rowKey={(record) => record.uid}
            scroll={{ x: 'max-content', y: 410 }}
            size="small"
            bordered
          />
        </TabPane>
        <TabPane tab="Youth" key="youth">
          <Table
            dataSource={data}
            pagination={false}
            columns={columns(onCellClick, handleSaveField)}
            loading={isLoading}
            rowKey={(record) => record.uid}
            scroll={{ x: 'max-content', y: 410 }}
            size="small"
            bordered
          />
        </TabPane>
        {isSearch && (
          <TabPane tab="Search Results" key="delay">
            <Table
              dataSource={data}
              pagination={false}
              columns={searchColumns(onCellClick, handleSaveField)}
              loading={isLoading}
              rowKey={(record) => record.uid}
              scroll={{ x: 'max-content', y: 410 }}
              size="small"
              bordered
            />
          </TabPane>
        )}
      </Tabs>
      <Modal
        title={modalState.title}
        visible={modalState.isVisible}
        destroyOnClose
        onCancel={() => setModalState({ ...modalState, isVisible: false })}
        footer={null}
      >
        {modalState.content}
      </Modal>
    </UpToSpeakContainer>
  );
};

export default UpToSpeak;
