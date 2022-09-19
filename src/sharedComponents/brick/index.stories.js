import React from 'react';
import Brick from './index';

export default {
    title: 'Components/Brick',
    component: Brick,
};

export const Default = (props) => (
    <>
        <div style={{ backgroundColor: 'lightcoral' }}>Title</div>
        <Brick {...props} />
        <div style={{ backgroundColor: 'lightblue' }}>Space 16px/1rem by default</div>
    </>
);

Default.args = {
    sizeInPixels: 16,
};
