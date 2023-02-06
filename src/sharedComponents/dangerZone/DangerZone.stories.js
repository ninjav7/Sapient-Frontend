import React from 'react';
import DangerZone from './DangerZone';

import { ReactComponent as UnlinkSVG } from '../assets/icons/link-slash.svg';

import '../assets/scss/stories.scss';

export default {
    title: 'Others/DangerZone',
    component: DangerZone,
};

export const Default = () => (
    <DangerZone
        title="Danger Zone"
        onClickButton={() => {}}
        iconButton={<UnlinkSVG />}
        labelButton="Unlink All Breakers"
    />
);
