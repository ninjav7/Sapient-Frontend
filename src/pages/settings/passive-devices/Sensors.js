import React from 'react';
import Brick from '../../../sharedComponents/brick';
import { ReactComponent as ChartSVG } from '../../../assets/icon/chart.svg';
import '../../../sharedComponents/breaker/Breaker.scss';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import EditSensor from './EditSensor';
import './styles.scss';

const Sensors = (props) => {
    const { data, userPermission, handleChartShow, fetchPassiveDeviceSensorData } = props;

    return (
        <>
            {data.map((record, index) => {
                const isSensorNotConfigured = record?.equipment_id === '' && record?.breaker_id === '';
                const isSensorFlagged = record?.breaker_rated_amps > record?.rated_amps;

                return (
                    <div key={index} data-testid={record?.name}>
                        <Brick sizeInRem={0.75} />

                        <div
                            className={`d-flex justify-content-between sensor-container sensor-wrapper ${
                                isSensorNotConfigured ? `sensor-unattach` : ``
                            } ${isSensorFlagged ? `partially-configured` : ``} `}>
                            <div className="d-flex align-items-center mouse-pointer">
                                <Typography.Subheader size={Typography.Sizes.md} className="sensor-index mr-4">
                                    {record?.index}
                                </Typography.Subheader>

                                {isSensorNotConfigured ? (
                                    <Typography.Subheader size={Typography.Sizes.md} className="mr-4 sensor-index">
                                        Not Attached
                                    </Typography.Subheader>
                                ) : record?.breaker_rated_amps && record?.breaker_rated_amps !== 0 ? (
                                    <div className="d-flex mr-4">
                                        <Typography.Subheader size={Typography.Sizes.md}>
                                            {`${record?.breaker_link}, `}
                                        </Typography.Subheader>
                                        <div
                                            className="font-normal ml-1"
                                            data-testid="breaker-amps">{`${record?.breaker_rated_amps}A`}</div>
                                    </div>
                                ) : (
                                    <Typography.Subheader size={Typography.Sizes.md} className="mr-4">
                                        {record?.equipment_id === ''
                                            ? `${record?.breaker_link}`
                                            : `${record?.breaker_link}, `}
                                    </Typography.Subheader>
                                )}

                                {record?.equipment_id !== '' && record?.breaker_id !== '' && (
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        className="sensor-equip typography-wrapper link"
                                        style={{ fontWeight: '500' }}>
                                        {record?.equipment}
                                    </Typography.Subheader>
                                )}
                            </div>
                            <div className="d-flex align-items-center">
                                <Typography.Body size={Typography.Sizes.xxl} className="gray-500 mouse-pointer mr-3">
                                    {`${record?.rated_amps}A`}
                                </Typography.Body>
                                <Button
                                    className="breaker-action-btn"
                                    onClick={() => handleChartShow(record?.id)}
                                    type={Button.Type.secondaryGrey}
                                    label=""
                                    icon={<ChartSVG width={16} />}
                                />
                                {userPermission?.user_role === 'admin' ||
                                userPermission?.permissions?.permissions?.advanced_passive_device_permission?.edit ? (
                                    <EditSensor
                                        sensorObj={record}
                                        fetchPassiveDeviceSensorData={fetchPassiveDeviceSensorData}
                                        {...props}
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default Sensors;
