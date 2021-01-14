import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert } from 'antd';

// layout
import Layout from '../../layouts/Main/Main';

function NoAuth() {
    const [count, setCountDown] = useState(10);
    const history = useHistory();

    useEffect(() => {
        setTimeout(() => {
            if (count !== 1) return setCountDown(count - 1);

            return history.push('/admin');
        }, 1000);
    }, [count]);

    return (
        <Layout>
            <Alert
                message="Insufficient Permissions"
                description={
                    <span>
                        You do not have the correct permissions to view this page. Please contact your administrator.
                        <br />
                        You will be redirected in {count} seconds. {/* eslint-disable-line */}
                    </span>
                }
                type="info"
                styles={{ marginTop: '100px' }}
            />
        </Layout>
    );
}

export default NoAuth;
