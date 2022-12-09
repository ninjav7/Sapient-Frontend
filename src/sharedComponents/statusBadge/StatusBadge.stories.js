import React from 'react';
import {StatusBadge} from './index';
import { ReactComponent as WifiSVG } from '../../sharedComponents/assets/icons/wifi.svg';
import { ReactComponent as WifiSlashSVG } from '../../sharedComponents/assets/icons/wifislash.svg';
export default {
    title: 'Components/StatusBadge',
    component: StatusBadge,
};

export const Default = () => {
    return (
        <>
            <StatusBadge text="17 m" type={StatusBadge.Type.warning} />
            <StatusBadge text="Office" type={StatusBadge.Type.warning}  icon={<WifiSVG />}/>
            <StatusBadge text="Online" type={StatusBadge.Type.success} icon={<WifiSVG />}/>
            <StatusBadge text="Online" type={StatusBadge.Type.success} />
            <StatusBadge text="Office" icon={<WifiSVG />} type={StatusBadge.Type.error} />
            <StatusBadge text="Offline" type={StatusBadge.Type.error} />
        </>
    );
};