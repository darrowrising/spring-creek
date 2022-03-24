import React, { useEffect, useState } from 'react';
import { notification, Table, Tabs, Modal } from 'antd';
// components
import Heading from '../../../../components/Heading';
import SetToSpeak from './Modals/SetToSpeak';
import RemoveFromSpeaking from './Modals/RemoveFromSpeaking';
// utils
import { fetchWhoSpokeLast, unsubscribe } from './utils';
// configs
import { columns } from './config';
import { SET_TO_SPEAK, REMOVE } from './enums';
// styles
import { UpToSpeakContainer } from './styles';

const initialState = {
  speakers: [],
  isLoading: false,
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
  const [{ speakers, isLoading, isError }, setState] = useState(initialState);
  const [activeTab, setTab] = useState('adult');
  const [modalState, setModalState] = useState(modalInitialState);

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

  useEffect(() => {
    fetchWhoSpokeLast(setState, activeTab);
    return () => unsubscribe();
  }, [activeTab]);

  useEffect(() => {
    if (isError)
      return notification.error({
        message: 'OH NO!',
        description: 'We could not find the list of people to speak',
      });
  }, [isError]);

  // data
  const data = speakers.map((speaker) => ({ ...speaker, onClick: handleMoreOnClick }));

  return (
    <UpToSpeakContainer>
      <Heading secondary>Up to Speak</Heading>
      <Tabs
        defaultActiveKey={activeTab}
        activeKey={activeTab}
        type="card"
        size="small"
        onChange={(tabKey) => setTab(tabKey)}
      >
        <TabPane tab="Adult" key="adult">
          <Table
            dataSource={data}
            pagination={false}
            columns={columns}
            loading={isLoading}
            rowKey={(record) => record.uid}
            scroll={{ x: 'max-content', y: 500 }}
            size="small"
            bordered
          />
        </TabPane>
        <TabPane tab="Youth" key="youth">
          <Table
            dataSource={data}
            pagination={false}
            columns={columns}
            loading={isLoading}
            rowKey={(record) => record.uid}
            scroll={{ x: 'max-content', y: 500 }}
            size="small"
            bordered
          />
        </TabPane>
      </Tabs>
      <Modal title={modalState.title} visible={modalState.isVisible}>
        {modalState.content}
      </Modal>
    </UpToSpeakContainer>
  );
};

export default UpToSpeak;
