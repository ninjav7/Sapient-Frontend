import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { Notification } from '../notification';

import { ReactComponent as RefreshSVG } from '../assets/icons/arrows-rotate.svg';
import './NoFilteredDataAlert.scss';

const NoFilteredDataAlert = ({ text, onRefreshClick, className, style }) => {
    return (
        <div className={cx('no-filtered-data-alert-wrapper', className)} style={style}>
            <Notification
                type={Notification.Types.error}
                component={Notification.ComponentTypes.alert}
                description={
                    text || <div className="no-filtered-data-alert-text">No filtered data for this time period</div>
                }
                customCloseNode={
                    onRefreshClick && (
                        <button onClick={onRefreshClick} className="reset-styles align-self-center">
                            <RefreshSVG className="no-filtered-data-alert-refresh-btn" />
                        </button>
                    )
                }
            />
        </div>
    );
};

NoFilteredDataAlert.propTypes = {
    text: PropTypes.string,
    onRefreshClick: PropTypes.func.isRequired,
};

export default NoFilteredDataAlert;
