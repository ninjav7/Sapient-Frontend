import React from 'react';

import { Button } from '../../button';

import { ReactComponent as DownloadSVG } from '../../assets/icons/download.svg';

export const DownloadButton = (props) => {
    return (
        <Button
            label={''}
            type={Button.Type.secondaryGrey}
            size={Button.Sizes.md}
            icon={<DownloadSVG />}
            className="data-table-widget-action-button"
            {...props}
        />
    );
};
