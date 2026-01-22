import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Form, Input, notification, Modal, Popconfirm, Table } from 'antd';
import { lighten } from 'polished';
import { arrayOf, func, number, shape, string } from 'prop-types';

import Button, { ButtonRow } from '../../../components/Button';
import { markSearchValue, uuid } from '../../../utils/data.utils';
import { db, docs } from '../../../utils/firebase.utils';
import { utc } from '../../../utils/date.utils';
import { colorBlue1, media } from '../../../styles/variables';

const { Search } = Input;

// #region utils
const createHymn = ({ createdOn, link = '', number: hymnNumber, title, uid }) => ({
  createdOn: createdOn || utc(),
  link,
  number: typeof hymnNumber === 'string' ? Number(hymnNumber) : hymnNumber,
  title,
  uid: uid || uuid(),
  updatedOn: utc(),
});

const deleteHymn = ({ uid }) => {
  db.collection('hymns')
    .doc(uid)
    .delete()
    .then(() => {
      notification.success({
        message: 'hymn has been deleted',
      });
    });
};

const handleRowClass = ({ number: hymnNumber }) => {
  if (hymnNumber >= 1000 && hymnNumber < 1200) return 'sabbath-weekday';
  if (hymnNumber >= 1200) return 'easter-christmas';
  return 'original';
};
// #endregion utils

// #region ModalForm
const ModalForm = ({ form, hymns, hymnToEdit = {}, onClose }) => {
  const onSubmit = async (newHymn) => {
    const hymn = createHymn({ ...hymnToEdit, ...newHymn });
    const doc = db.collection('hymns').doc(hymn.uid);

    if (hymnToEdit?.uid) doc.update(hymn);
    else doc.set(hymn);

    onClose();
  };

  return (
    <Form autoComplete="off" form={form} initialValues={hymnToEdit} layout="vertical" onFinish={onSubmit}>
      <Form.Item
        label="Number"
        name="number"
        rules={[
          {
            required: true,
            message: 'This field is required',
          },
          () => ({
            validator(_, value = '') {
              if (hymnToEdit?.uid) return Promise.resolve();

              const exist = hymns.some(({ number: hymnNumber }) => hymnNumber === Number(value));

              if (exist) return Promise.reject(new Error('Hymn number already exist'));
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label="Title"
        name="title"
        rules={[
          {
            required: true,
            message: 'This field is required',
          },
          () => ({
            validator(_, value = '') {
              if (hymnToEdit?.uid) return Promise.resolve();

              const exist = hymns.some(({ title }) => title === value);

              if (exist) return Promise.reject(new Error('Hymn title already exist'));
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="URL of PDF version of the hymn (optional)" name="link">
        <Input type="url" placeholder="url" />
      </Form.Item>
      <Form.Item>
        <ButtonRow>
          <Button color="primary" htmlType="submit">
            Save
          </Button>
          <Button type="button" onClick={() => onClose()}>
            Cancel
          </Button>
        </ButtonRow>
      </Form.Item>
    </Form>
  );
};
// #endregion ModalForm

ModalForm.propTypes = {
  form: shape({}).isRequired,
  hymns: arrayOf(
    shape({
      uid: string,
      number,
      title: string,
      link: string,
    })
  ).isRequired,
  hymnToEdit: shape({
    uid: string,
    number,
    title: string,
    link: string,
  }),
  onClose: func.isRequired,
};

// #region styles
const ActionBar = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);

  ${media.tablet} {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
  }

  ${media.mobile} {
    gap: var(--space-2);
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
      min-width: 600px;
    }
  }
`;
// #endregion styles

// #region configs
const columns = (onEdit) => [
  {
    title: 'Number',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'topic',
    render: (record) => <span dangerouslySetInnerHTML={{ __html: record }} />,
  },
  {
    title: '',
    key: 'action',
    render: (record) => (
      <ButtonRow>
        <Button size="small" onClick={() => onEdit(record)}>
          Edit
        </Button>
        <Popconfirm
          title="Delete Hymn"
          description="Are you sure you want to delete this hymn?"
          okText="Remove"
          onConfirm={() => deleteHymn(record)}
        >
          <Button color="red" size="small">
            Delete
          </Button>
        </Popconfirm>
      </ButtonRow>
    ),
  },
];
// #endregion configs

// #region Hymns
function Hymns({ className }) {
  const [loading, setLoading] = useState(true);
  const [hymns, setHymns] = useState([]);
  const [filteredHymns, setFilteredHymns] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hymnToEdit, setHymnToEdit] = useState({});

  const [form] = Form.useForm();

  const onCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setHymnToEdit({});
    setFilteredHymns(null);
  };

  const onEdit = (record) => {
    setHymnToEdit(record);
    setIsModalOpen(true);
  };

  const onSearch = (searchItem) => {
    setLoading(true);

    const num = Number(searchItem);
    const isNumber = Number.isInteger(num);
    let searchResults = null;

    if (searchItem) {
      searchResults = hymns
        .filter(({ number: hymnNumber, title }) => {
          if (isNumber) return hymnNumber === num;
          return title.toLowerCase().includes(searchItem.toLowerCase());
        })
        .map(({ title, ...rest }) => ({ title: markSearchValue(title, searchItem), ...rest }));
    }

    setTimeout(() => {
      setFilteredHymns(searchResults);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const unsubscribe = db
      .collection('hymns')
      .orderBy('number')
      .onSnapshot((snap) => {
        const data = docs(snap);

        setHymns(data);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const hymnData = filteredHymns || hymns;

  return (
    <div className={className}>
      <ActionBar>
        <Button color="primary" onClick={() => setIsModalOpen(true)}>
          Add Hymn
        </Button>
        <SearchContainer>
          <Search
            placeholder="search by number or title"
            onSearch={onSearch}
            style={{ width: '100%' }}
            aria-label="search"
          />
        </SearchContainer>
      </ActionBar>
      <TableContainer>
        <Table
          dataSource={hymnData}
          pagination={false}
          columns={columns(onEdit)}
          loading={loading}
          rowKey={(record) => record.uid}
          scroll={{ x: 'max-content', y: 500 }}
          size="small"
          bordered
          rowClassName={handleRowClass}
        />
      </TableContainer>
      <Modal title="Add/Edit Hymn" open={isModalOpen} footer={null} onCancel={onCancel}>
        <ModalForm form={form} hymnToEdit={hymnToEdit} hymns={hymnData} onClose={onCancel} />
      </Modal>
    </div>
  );
}

Hymns.propTypes = {
  className: string,
};

export default styled(Hymns)`
  display: grid;
  gap: var(--space-4);

  .sabbath-weekday {
    background-color: ${lighten(0.55, colorBlue1)};
  }
  .easter-christmas {
    background-color: ${lighten(0.45, colorBlue1)};
  }
`;
// #endregion Hymns
