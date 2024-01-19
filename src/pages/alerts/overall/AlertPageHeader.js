import React from 'react';
import { useHistory } from 'react-router-dom';

import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';

import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const AlertPageHeader = (props) => {
    const history = useHistory();
    const { alertType = 'open-alerts', handleTabSwitch } = props;

    return (
        <div className="alerts-header-wrapper d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between">
                <Typography.Header
                    size={Typography.Sizes.lg}
                    style={{ color: colorPalette.primaryGray700 }}
                    className="font-weight-bold">{`Alerts`}</Typography.Header>
                <div className="d-flex">
                    <Button
                        label={'Add Alert'}
                        size={Button.Sizes.md}
                        type={Button.Type.primary}
                        icon={<PlusSVG />}
                        onClick={() => {
                            history.push({ pathname: '/alerts/overview/add-alert' });
                        }}
                    />
                </div>
            </div>

            <div className="d-flex">
                <Typography.Header
                    id="open-alerts"
                    size={Typography.Sizes.xs}
                    className={`mouse-pointer mr-4 ${alertType === 'open-alerts' ? `active-tab` : ``}`}
                    style={{ color: colorPalette.primaryGray500 }}
                    onClick={handleTabSwitch}>
                    Open Alerts
                </Typography.Header>
                <Typography.Header
                    id="closed-alerts"
                    size={Typography.Sizes.xs}
                    className={`mouse-pointer mr-4 ${alertType === 'closed-alerts' ? `active-tab` : ``}`}
                    style={{ color: colorPalette.primaryGray500 }}
                    onClick={handleTabSwitch}>
                    Closed Alerts
                </Typography.Header>
                <Typography.Header
                    id="alert-settings"
                    size={Typography.Sizes.xs}
                    className={`mouse-pointer mr-4 ${alertType === 'alert-settings' ? `active-tab` : ``}`}
                    style={{ color: colorPalette.primaryGray500 }}
                    onClick={handleTabSwitch}>
                    {`Alert Settings`}
                </Typography.Header>
            </div>
        </div>
    );
};

export default AlertPageHeader;
