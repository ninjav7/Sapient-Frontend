import React from 'react';
import { useHistory } from 'react-router-dom';

import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';

import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const AlertPageHeader = (props) => {
    const history = useHistory();
    const { activeTab = false, handleTabSwitch } = props;

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
                            history.push({ pathname: '/alerts/overall/add-alert' });
                        }}
                    />
                </div>
            </div>

            <div className="d-flex">
                <Typography.Header
                    id="0"
                    size={Typography.Sizes.xs}
                    className={`mouse-pointer mr-4 ${activeTab === 0 ? `active-tab` : ``}`}
                    style={{ color: colorPalette.primaryGray500 }}
                    onClick={handleTabSwitch}>
                    Open Alerts
                </Typography.Header>
                <Typography.Header
                    id="1"
                    size={Typography.Sizes.xs}
                    className={`mouse-pointer mr-4 ${activeTab === 1 ? `active-tab` : ``}`}
                    style={{ color: colorPalette.primaryGray500 }}
                    onClick={handleTabSwitch}>
                    Closed Alerts
                </Typography.Header>
                <Typography.Header
                    id="2"
                    size={Typography.Sizes.xs}
                    className={`mouse-pointer mr-4 ${activeTab === 2 ? `active-tab` : ``}`}
                    style={{ color: colorPalette.primaryGray500 }}
                    onClick={handleTabSwitch}>
                    {`Alert Settings`}
                </Typography.Header>
            </div>
        </div>
    );
};

export default AlertPageHeader;
