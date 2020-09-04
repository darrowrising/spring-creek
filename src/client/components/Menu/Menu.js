import React from 'react';
import { Menu } from 'antd';
// import {} from 'prop-types';

// styles
// import {} from './Menu.styles';

function MenuComp() {
    const handleClick = (event) => {
        console.log('event:', event);
    };

    return (
        <Menu onClick={handleClick}>
            <Menu.Item key="9">Program Maker</Menu.Item>
        </Menu>
    );
}

// MenuComp.propTypes = {

// };

// MenuComp.defaultProps = {

// };

export default MenuComp;
