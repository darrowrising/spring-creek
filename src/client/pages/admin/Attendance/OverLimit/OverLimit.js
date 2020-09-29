import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

// components
import Loading from '../../../../components/Loading/Loading';
// configs
import { tableColumns } from './OverLimit.configs';
// utils
import { getData, unsubscribe } from './OverLimit.utils';
// styles
// import {} from './OverLimit.styles';
import { Container, Wrapper } from '../List/List.styles';

const initialState = {
    loading: true,
    data: []
};

function OverLimit() {
    // hooks
    const [state, setState] = useState(initialState);
    // data
    const { loading, data } = state;

    useEffect(() => {
        getData(setState);

        return () => unsubscribe();
    }, []);

    return (
        <Container>
            <p>Families that have been asked to watch broadcast due to the meeting being over limit.</p>
            {
                loading
                    ? <Loading />
                    : (
                        <Wrapper>
                            <Table
                                columns={tableColumns}
                                dataSource={data}
                                rowKey={record => record.uid}
                                pagination={false}
                                style={{ width: '100%' }}
                            />
                        </Wrapper>
                    )
            }
        </Container>
    );
}

export default OverLimit;
