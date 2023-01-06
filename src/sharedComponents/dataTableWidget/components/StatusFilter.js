import React, { useCallback, useContext } from 'react';
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
    const {
        widgetProps: { onStatus, status, buttonGroupFilterOptions },
    } = useContext(DataTableWidgetContext);

    const handlerClick = useCallback((id) => {
        onStatus(id, buttonGroupFilterOptions ? buttonGroupFilterOptions[id].label : STATUS_FILTER_OPTIONS[id].label);
    }, []);

    return (
        <ButtonGroup
            currentButtonId={status || 0}
            buttons={buttonGroupFilterOptions || STATUS_FILTER_OPTIONS}
            {...props}
            handleButtonClick={handlerClick}
        />
    );
};

export { StatusFilter };
