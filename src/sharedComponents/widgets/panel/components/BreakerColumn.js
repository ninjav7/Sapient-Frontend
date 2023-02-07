import React, { useContext } from 'react';
import { Breaker } from '../../../breaker';

import { mergePropsByAccessors } from '../helper';
import { PanelWidgetContext } from '../Panel';

import { PROP_TYPES } from '../constants';

const BreakerColumn = ({ edge: [_, columnData], nodes, callBackBreakerProps, breakerPropsAccessor, ...props }) => {
    const { viewDeviceIds } = useContext(PanelWidgetContext);

    const children = columnData.reduce((acc, breakerData) => {
        acc[breakerData.source] = nodes[breakerData.source];
        acc[breakerData.target] = nodes[breakerData.target];
        return acc;
    }, {});

    // Optimize?
    const preparedBreakersProps = Object.entries(children).reduce((acc, [key, breakerData]) => {
        const userProps = mergePropsByAccessors(Object.entries(breakerPropsAccessor), breakerData);

        const breakerProps = {
            ...userProps,
            items: viewDeviceIds ? userProps.items : userProps.items.map((data) => ({ ...data, deviceId: null })),
            ...props,
            key,
        };

        const componentProps = callBackBreakerProps
            ? callBackBreakerProps({ breakerProps, breakerData, children, viewDeviceIds })
            : breakerProps;

        const { parentBreaker } = componentProps;
        const parentBreakerItems = acc[parentBreaker]?.items;

        if (parentBreaker) {
            if (parentBreakerItems.length > 2) {
                return { ...acc, [key]: componentProps };
            }
            parentBreakerItems.push(componentProps.items[0]);
        } else {
            acc[key] = componentProps;
        }

        return acc;
    }, {});

    return (
        <div className="panel-breaker-column">
            {Object.values(preparedBreakersProps).map((componentProps) => (
                <Breaker {...componentProps} equipmentName={!viewDeviceIds && componentProps.equipmentName} />
            ))}
        </div>
    );
};

BreakerColumn.propTypes = PROP_TYPES.breakerColumn;

export { BreakerColumn };
