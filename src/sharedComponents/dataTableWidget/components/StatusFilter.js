import React, { useContext } from 'react';
import { ButtonGroup } from '../../buttonGroup';
import { ReactComponent as WifiSVG } from '../../assets/icons/wifi.svg';
import { ReactComponent as WifiSlashSVG } from '../../assets/icons/wifislash.svg';
import { DataTableWidgetContext } from '../DataTableWidget';

const STATUS_FILTER_OPTIONS = [
    { label: 'All Statuses' },
    { label: 'Online', icon: <WifiSVG /> },
    { label: 'Offline', icon: <WifiSlashSVG /> },
];

const StatusFilter = (props) => {
    const { widgetProps } = useContext(DataTableWidgetContext);

    return (
        <ButtonGroup
            currentButtonId={widgetProps.currentStatusId - 1  || 0}
            buttons={widgetProps.buttonGroupFilterOptions || STATUS_FILTER_OPTIONS}
            {...props}
            handleButtonClick={(id) => widgetProps.onStatus(id, STATUS_FILTER_OPTIONS[id].label)}
        />
    );
};

export { StatusFilter };
