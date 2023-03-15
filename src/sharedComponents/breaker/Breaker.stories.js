import React from 'react';
import Breaker from './Breaker';
import '../assets/scss/stories.scss';
import { stringOrNumberPropTypes } from '../helpers/helper';
import PropTypes from 'prop-types';

export default {
    title: 'Components/Breaker',
    component: Breaker,
};

export const Default = (props) => {
    return (
        <>
            <Breaker {...props} />
            <hr />
            <Breaker
                {...props}
                equipmentName="A Long Equipment Name Should be cut by css. Let`s see if it is working "
            />
            <hr />
            <Breaker {...props} items={[...props.items, ...props.items]} />
            <hr />
            <Breaker {...props} items={[...props.items, ...props.items, ...props.items]} />
            <hr />

            <Breaker
                {...props}
                items={[{ ...props.items[0], deviceId: '00-B0-D0-63-C2-26' }]}
                equipmentName={undefined}
            />
            <hr />
            <Breaker {...props} items={[...props.items, ...props.items]} />
            <hr />
            <Breaker
                {...props}
                items={new Array(2).fill({ ...props.items[0], deviceId: '00-B0-D0-63-C2-26' })}
                equipmentName={undefined}
            />
            <hr />
            <Breaker
                {...props}
                items={new Array(3).fill({ ...props.items[0], deviceId: '00-B0-D0-63-C2-26' })}
                equipmentName={undefined}
            />

            <hr />
            <br />
            <h6>Flagged</h6>
            <Breaker {...props} equipmentName={undefined} isFlagged />

            <hr />
            <h4>Types</h4>
            <br />
            <h6>Not Configured</h6>
            <Breaker {...props} equipmentName={undefined} type={Breaker.Type.notConfigured} />
            <br />
            <h6>Partially Configured</h6>
            <Breaker {...props} equipmentName={undefined} type={Breaker.Type.partiallyConfigured} />
            <br />
            <h6>Configured (Default state)</h6>
            <Breaker
                {...props}
                equipmentName={undefined}
                // You can leave "type" as undefined
            />
            <br />
            <h6>Offline Breaker</h6>
            <Breaker {...props} equipmentName={undefined} type={Breaker.Type.offline} />
            <br />
            <h6>Loading Breaker</h6>
            <Breaker {...props} isLoading />
        </>
    );
};

Default.args = {
    items: [
        {
            id: '1',
            status: Breaker.Status.online,
            sensorId: '4-2',
            deviceId: '00-B0-D0-63-C2-26',
        },
    ],

    ratedAmps: '40 A',
    ratedVolts: '120 V',
    onEdit: (props) => alert('OnEdit'),
    onShowChart: (props) => alert('OnShowChart'),
};
