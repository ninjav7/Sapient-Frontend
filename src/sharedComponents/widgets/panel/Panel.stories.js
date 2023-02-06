import React from 'react';

import Panel from './Panel';
import Breaker from '../../breaker/Breaker';

import { edges, nodes } from './mock';

import '../../assets/scss/stories.scss';

export default {
    title: 'Widgets/Panel',
    component: Panel,
};

export const Default = (props) => <Panel {...props} />;

/**
 * @namespace DefaultArgs
 * @property {object}  Default - The Props for component.
 * @property {function}  defaults.args.callBackBreakerProps - Optional function, for modify props per breaker.
 * @property {object}  defaults.args.breakerPropsAccessor - Required object, provide props accessors.
 */
Default.args = {
    typeOptions: [{ label: 'Disconnect', value: 1 }],
    typeProps: {
        onChange: () => alert('on change type'),
        defaultValue: 1,
    },

    numberOfBreakers: {
        onChange: () => alert('numberOfBreakers onChange'),
        defaultValue: 24,
    },
    startingBreaker: {
        onChange: () => alert('startingBreaker onChange'),
        defaultValue: 1,
    },
    mainBreaker: {
        items: [
            {
                id: 'M',
                status: Breaker.Status.online,
            },
        ],
        type: Breaker.Type.configured,
        ratedAmps: '40 A',
        ratedVolts: '120 V',
    },
    callBackBreakerProps: ({ breakerProps, breakerData, children }) => {
        console.log(breakerProps, breakerData, children);
        const equipmentName = breakerData.equipment_links[0]?.name;
        const status = Breaker.Status.online;

        //here you can modify props for breakers
        return {
            ...breakerProps,
            equipmentName,
            items: breakerProps.items.map((breakerProp) => ({ ...breakerProp, status })),
        };
    },
    breakerPropsAccessor: {
        // for items array
        id: 'breaker_number',
        status: 'status',
        deviceId: 'device_id',
        sensorId: 'sensor_id',

        ratedAmps: 'rated_amps',
        ratedVolts: 'voltage',
        equipmentName: 'equipment_name',
        isFlagged: 'is_flagged',
        type: 'type',
        parentBreaker: 'parent_breaker',
        // here you can specify custom props and catch them in handlers
        _id: 'id',
    },
    onEdit: (props) => {
        alert('OnEdit');
        console.log('OnEdit', props);
    },
    onShowChart: (props) => {
        alert('onShowChart');
        console.log('onShowChart', props);
    },
    onBreakerLinkedClick: (props) => {
        alert('onBreakerLinkedClick: ' + `${props.source} - ${props.target}`);
        console.log('onBreakerLinkedClick', props);
    },
    onPanelEditClick: ({ isEditingMode }) => console.log(isEditingMode),
    onPanelToggleDeviceView: ({ viewDeviceIds }) => console.log(viewDeviceIds),

    isEditable: true,

    // Optional, to set states for viewing and edition modes
    states: {
        isEditingModeState: false,
        isViewDeviceIdsState: false,
    },

    dangerZoneProps: {
        onClickButton: (event) => alert('dangerZoneProps onClick'),
    },

    edges,
    nodes,
    style: {
        width: 906,
    },
};
