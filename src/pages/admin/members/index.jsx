import { useEffect, useState } from 'react';
import { Modal, notification, Table, Button, Input } from 'antd';
import styled from 'styled-components';

import NewMembers from './NewMembers';
import { useAdminContext } from '../../../providers/admin.provider';
import EditMember from './AddEditMember';

import { db } from '../../../utils/firebase.utils';
import { handleState, hasData, search } from '../../../utils/data.utils';
import { media } from '../../../styles/variables';

import { tableHeaders } from './headers';

const Search = styled(Input.Search)`
  .ant-input-affix-wrapper {
    height: 36px;

    input {
      height: 26px;
    }
  }
`;

const Bar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
  gap: var(--space-3);
  align-items: center;

  ${media.tablet} {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
  }

  button {
    margin-right: 15px;

    ${media.tablet} {
      margin-right: 0;
    }
  }

  .left {
    margin-right: auto;

    ${media.tablet} {
      margin-right: 0;
    }
  }
`;

const SearchContainer = styled.div`
  ${media.tablet} {
    width: 100%;
  }
`;

const TableContainer = styled.div`
  ${media.tablet} {
    overflow-x: auto;

    .ant-table {
      min-width: 800px;
    }
  }
`;

// const StatusColor = styled.span`
//   color: ${(props) => {
//     const { status } = props;
//     if (status === 'deactivated') return `${theme('color_danger')(props)}`;
//     if (status === 'activated') return `${theme('color_success')(props)}`;
//     return 'inherit';
//   }};
// `;

const removeMember = async (member) => {
  try {
    await db.collection('members').doc(member.uid).delete();

    notification.success({
      message: 'Member has been deactivated',
    });
  } catch (error) {
    notification.error({
      message: 'There was a problem deactivating member.',
    });
    console.error('error deactivating member', error);
  }
};

const SEARCH_KEY_ALLOW_LIST = ['email', 'displayName', 'callingsDisplay', 'status'];

const searchList = (list, value) => search(list, value, SEARCH_KEY_ALLOW_LIST);

const INITIAL_STATE = {
  showModal: false,
  modalContent: {},
  modalTemplate: '',
};

function Members() {
  const [state, setState] = useState(INITIAL_STATE);
  const { members, newMembers, loading } = useAdminContext();

  const { showModal, modalContent, modalTemplate } = state;
  const ModalContentComp = modalTemplate;

  const set = (update) => handleState(update, setState);

  const [filters, setFilters] = useState({
    status: ['active', 'pending', 'inactive'],
  });
  const [list, setList] = useState([]);
  const [sort, setSort] = useState({});
  const [searchValue, setSearchValue] = useState('');
  // data
  const columns = tableHeaders(filters, sort, searchValue);

  // handlers
  const handleChange = (pagination, antFilters, sorter) => {
    setFilters(antFilters);
    setSort(sorter);
  };
  const handleClear = () => {
    setFilters({});
    setSort({});
    setList(members);
    setSearchValue('');
  };
  const handleSearch = (event) => {
    const { value } = event?.target ?? {};

    setList(searchList(members, value));
    setSearchValue(value);
  };

  useEffect(() => {
    if (searchValue) {
      /* if they have searched and made an edit to a member's record
       * reestablish the user's search state with the updated member list */
      setList(searchList(members, searchValue));
    } else {
      setList(members);
    }
  }, [members, searchValue]);

  const handleOnClick = (record, type) => {
    switch (type) {
      case 'edit': {
        return set({
          showModal: true,
          modalContent: record,
          modalTemplate: EditMember,
        });
      }
      case 'remove':
        removeMember(record);
        return;
      default:
        return null;
    }
  };

  const data = list.map((items) => ({ ...items, memberState: set, onClick: handleOnClick }));

  return (
    <>
      {hasData(newMembers) && <NewMembers newMembers={newMembers} />}
      <section>
        <Bar>
          <Button type="primary" className="left" onClick={() => handleOnClick({}, 'edit')}>
            Add Member
          </Button>
          <Button onClick={handleClear}>Clear Filters and Sort</Button>
          <SearchContainer>
            <Search
              placeholder="search"
              onChange={handleSearch}
              style={{ width: '100%' }}
              value={searchValue}
              allowClear
            />
          </SearchContainer>
        </Bar>
        <TableContainer>
          <Table
            dataSource={data}
            pagination
            columns={columns}
            loading={loading}
            onChange={handleChange}
            rowKey={(record) => record.uid}
            scroll={{ x: 'max-content' }}
          />
        </TableContainer>
      </section>
      <Modal
        header={null}
        footer={null}
        open={showModal}
        onCancel={() => set({ modalContent: {}, showModal: false })}
        destroyOnHidden
      >
        <ModalContentComp content={modalContent} setParentState={set} />
      </Modal>
    </>
  );
}

export default Members;
