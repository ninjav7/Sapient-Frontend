import React from 'react';
import { Spinner } from 'reactstrap';

import { Button } from '../../button';

import { ReactComponent as DownloadSVG } from '../../assets/icons/download.svg';

export const DownloadButton = (props) => {
    const { isCSVDownloading = false } = props;
    return (
        <Button
            label={''}
            type={Button.Type.secondaryGrey}
            size={Button.Sizes.md}
            icon={!isCSVDownloading ? <DownloadSVG /> : <Spinner size="sm" color="secondary" />}
            className="data-table-widget-action-button"
            {...props}
        />
    );
};
