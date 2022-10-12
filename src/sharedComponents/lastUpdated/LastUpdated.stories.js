import React from 'react';
import LastUpdated from './LastUpdated';
import '../assets/scss/stories.scss';
import { TimeFrameSelector } from '../timeFrameSelector';

export default {
    title: 'Components/LastUpdated',
    component: LastUpdated,
};

export const Default = (props) => <LastUpdated {...props} />;

Default.args = {
    initialValues: {
        active: 'more-than',
        'within-the-last': {
            value: '0',
            period: 'minutes',
        },
        'more-than': {
            value: '0',
            period: 'minutes ago',
        },
        'date-range': {
            period: { ...TimeFrameSelector.options[0] },
            rangeDate: TimeFrameSelector.options[0].moment(),
        },
    },
};
