import React, { useCallback } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Typography from '../typography';
import { Badge } from '../badge';
import { Button } from '../button';

import { generateID, removeProps, stringOrNumberPropTypes } from '../helpers/helper';
import { BREAKER_CALLBACKS, BREAKER_ITEMS_PROP_MAP, BREAKER_STATUSES, BREAKER_TYPES } from './constants';

import { ReactComponent as ChartSVG } from '../assets/icons/chart-mixed.svg';
import { ReactComponent as PenSVG } from '../assets/icons/pen.svg';
import { ReactComponent as LoadingSVG } from '../assets/icons/loading.svg';

import './Breaker.scss';

const Indicator = ({ status }) => {
    return <div className={cx('breaker-indicator', `breaker-indicator-${status}`)} />;
};

const Breaker = (props) => {
    const {
        items,
        equipmentName,
        ratedAmps,
        ratedVolts,
        isFlagged,
        type = BREAKER_TYPES.configured,
        className,
        styleWrapper,
        isMain,
        isLoading,
    } = props;

    const onEdit = props[BREAKER_CALLBACKS.ON_EDIT];
    const onShowChart = props[BREAKER_CALLBACKS.ON_SHOW_CHART_DATA];

    const callBackMemoized = useCallback(
        (nameOfEvent, event) => {
            const currentCallBack = props[nameOfEvent];
            currentCallBack &&
                currentCallBack(
                    removeProps(
                        Object.assign({ event }, props),
                        'styleWrapper',
                        'className',
                        BREAKER_CALLBACKS.ON_EDIT,
                        BREAKER_CALLBACKS.ON_SHOW_CHART_DATA
                    )
                );
        },
        [onShowChart, onEdit]
    );

    return (
        <div
            className={cx('breaker-wrapper', {
                [`breaker-items-${items?.length}`]: !!items?.length,
                'is-flagged': isFlagged,
                [type]: !!type,
                'is-main': !!isMain,
                'is-loading': isLoading,
                className,
            })}
            style={styleWrapper}>
            {items && (
                <div className="breaker-content-collector breaker-id-wrapper">
                    {items.map(({ id }) => (
                        <div className="breaker-id" key={generateID()}>
                            <Typography.Subheader size={Typography.Sizes.md}>{id}</Typography.Subheader>
                        </div>
                    ))}
                </div>
            )}

            {items && (
                <div className="breaker-content-collector align-self-stretch">
                    {items.map(({ status }) => (
                        <div className="breaker-indicator-wrapper" key={generateID()}>
                            <Indicator status={status} />
                        </div>
                    ))}
                </div>
            )}

            <div className="breaker-rated-volts-amps text-right">
                <Typography.Body size={Typography.Sizes.xxs} className="gray-550">
                    {ratedAmps}
                </Typography.Body>
                <Typography.Body size={Typography.Sizes.xxs} className="gray-550">
                    {ratedVolts}
                </Typography.Body>
            </div>

            <div className="breaker-device-name">
                {equipmentName ? (
                    <Typography.Body
                        size={Typography.Sizes.xs}
                        className="gray-800"
                        style={{ marginLeft: equipmentName === 'Blank' ? '1.65rem' : '0rem' }}>
                        {equipmentName}
                    </Typography.Body>
                ) : (
                    items?.some(({ deviceId }) => deviceId) && (
                        <div className="breaker-content-collector breaker-device-wrapper">
                            {items.map(
                                ({ deviceId }) =>
                                    deviceId && (
                                        <div className="breaker-device-id" key={generateID()}>
                                            <Badge className="breaker-device-id-badge d-flex" text={deviceId} />
                                        </div>
                                    )
                            )}
                        </div>
                    )
                )}
            </div>

            {items && (
                <div className="breaker-content-collector breaker-sensor-id-wrapper ml-auto">
                    {items.map(({ sensorId }) => (
                        <div className="breaker-sensor-id" key={generateID()}>
                            <Typography.Subheader size={Typography.Sizes.md}>{sensorId}</Typography.Subheader>
                        </div>
                    ))}
                </div>
            )}

            <div className="breaker-action-buttons">
                {isLoading ? (
                    <LoadingSVG class="breaker-is-loading" />
                ) : (
                    <>
                        {onShowChart && (
                            <Button
                                className="breaker-action-btn"
                                onClick={(event) => callBackMemoized(BREAKER_CALLBACKS.ON_SHOW_CHART_DATA, event)}
                                type={Button.Type.secondaryGrey}
                                label=""
                                icon={<ChartSVG width={16} />}
                            />
                        )}
                        {onEdit && (
                            <Button
                                className="breaker-action-btn"
                                onClick={(event) => callBackMemoized(BREAKER_CALLBACKS.ON_EDIT, event)}
                                type={Button.Type.secondaryGrey}
                                label=""
                                icon={<PenSVG width={15} />}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

Breaker.Status = BREAKER_STATUSES;
Breaker.Type = BREAKER_TYPES;
Breaker.ItemsPropMap = BREAKER_ITEMS_PROP_MAP;

Breaker.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: stringOrNumberPropTypes,
            status: PropTypes.oneOf(Object.values(BREAKER_STATUSES)).isRequired,
            deviceId: stringOrNumberPropTypes,
            sensorId: stringOrNumberPropTypes,
        })
    ),
    ratedAmps: stringOrNumberPropTypes,
    ratedVolts: stringOrNumberPropTypes,
    equipmentName: PropTypes.string,
    onEdit: PropTypes.func,
    onShowChart: PropTypes.func,
    isFlagged: PropTypes.bool,
    type: PropTypes.oneOf(Object.values(Breaker.Type)),
    styleWrapper: PropTypes.object,
    isMain: PropTypes.bool,
    isLoading: PropTypes.bool,
};

export default Breaker;
