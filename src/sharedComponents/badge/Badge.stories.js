import React from 'react';
import { Badge } from './index';

export default {
    title: 'Components/Badge',
    component: Badge,
};

export const Default = () => {
    return (
        <div>
            <Badge text="Office" />
        </div>
    );
};
