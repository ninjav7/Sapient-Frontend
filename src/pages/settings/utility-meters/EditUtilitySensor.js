import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import { useAtom } from 'jotai';
import { Spinner, UncontrolledTooltip } from 'reactstrap';
import Skeleton from 'react-loading-skeleton';
import { buildingData } from '../../../store/globalState';
import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import colorPalette from '../../../assets/scss/_colors.scss';
import { Checkbox } from '../../../sharedComponents/form/checkbox';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { DeviceDetails } from './IndividualUtilityMeter';
import LineChart from '../../../sharedComponents/lineChart/LineChart';
import Select from '../../../sharedComponents/form/select';
import { fetchDateRange } from '../../../helpers/formattedChartData';
import Header from '../../../components/Header';
import { DateRangeStore } from '../../../store/DateRangeStore';
import { convertToMac, shadowChartMetrics, pulseChartMetrics, UTILITY_MONITOR } from './utils';
import {
    compareObjData,
    dateTimeFormatForHighChart,
    formatConsumptionValue,
    formatXaxisForHighCharts,
} from '../../../helpers/helpers';
import { getSensorGraphDataForUtilityMonitors, getSensorMetricYtdData, updateUtilitySensorServices } from './services';
import { UserStore } from '../../../store/UserStore';
import { BuildingStore } from '../../../store/BuildingStore';
import { ReactComponent as TooltipIcon } from '../../../sharedComponents/assets/icons/tooltip.svg';
import { formatSensorHeading } from './helper';
import './styles.scss';

const MetricsTab = (props) => {
    const { utilityMeterObj, sensorObj, bldgId } = props;

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [metric, setMetric] = useState(pulseChartMetrics);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const [sensorChartData, setSensorChartData] = useState([]);
    const [sensorYtdData, setSensorYtdData] = useState({});
    const [fetchingChartData, setFetchingChartData] = useState(false);

    const [selectedUnit, setSelectedUnit] = useState(metric[0].unit);
    const [selectedConsumption, setConsumption] = useState(metric[0].value);
    const [selectedConsumptionLabel, setSelectedConsumptionLabel] = useState(metric[0].Consumption);

    const handleUnitChange = (value) => {
        setConsumption(value);
        const obj = metric.find((record) => record?.value === value);
        setSelectedUnit(obj?.unit);
        setSelectedConsumptionLabel(obj?.Consumption);
    };

    const getRequiredConsumptionLabel = (value) => {
        let label = '';
        metric.map((m) => {
            if (m?.value === value) label = m?.label;
            return m;
        });
        return label;
    };

    const fetchSensorsChartData = async (selected_consmption, start_date, end_date, sensor_obj) => {
        if (!sensor_obj?.id) return;

        setFetchingChartData(true);
        setSensorChartData([]);

        const payload = {
            sensor_id: sensor_obj?.id,
            bldg_id: bldgId,
            date_from: encodeURIComponent(start_date),
            date_to: encodeURIComponent(end_date),
            tz_info: timeZone,
            selected_metric: encodeURIComponent(selected_consmption),
        };

        await getSensorGraphDataForUtilityMonitors(payload)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    if (response?.data.length !== 0) {
                        const responseData = response?.data;
                        let recordToInsert = [];

                        if (!(selected_consmption === 'current' || selected_consmption === 'voltage')) {
                            let formattedData = [];
                            responseData.map((el) => {
                                formattedData.push({
                                    x: new Date(el?.time_stamp).getTime(),
                                    y: el?.data === '' ? null : el?.data,
                                });
                            });
                            recordToInsert = [
                                {
                                    data: formattedData,
                                    name: getRequiredConsumptionLabel(selected_consmption),
                                },
                            ];
                        } else {
                            if (selected_consmption === 'current') {
                                const firstList = {
                                    data: [],
                                    name: `Amps_A`,
                                };
                                const secondList = {
                                    data: [],
                                    name: `Amps_B`,
                                };
                                const thirdList = {
                                    data: [],
                                    name: `Amps_C`,
                                };

                                responseData.map((el) => {
                                    if (el?.data === '') {
                                        firstList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                        secondList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                        thirdList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                    } else {
                                        firstList.data.push({
                                            x: new Date(el?.time_stamp).getTime(),
                                            y: el?.data?.Amps_A,
                                        });
                                        secondList.data.push({
                                            x: new Date(el?.time_stamp).getTime(),
                                            y: el?.data?.Amps_B,
                                        });
                                        thirdList.data.push({
                                            x: new Date(el?.time_stamp).getTime(),
                                            y: el?.data?.Amps_C,
                                        });
                                    }
                                });

                                recordToInsert = [firstList, secondList, thirdList];
                            }
                            if (selected_consmption === 'voltage') {
                                const firstList = {
                                    data: [],
                                    name: `Volts_A_N`,
                                };
                                const secondList = {
                                    data: [],
                                    name: `Volts_B_N`,
                                };
                                const thirdList = {
                                    data: [],
                                    name: `Volts_C_N`,
                                };

                                responseData.map((el) => {
                                    if (el?.data === '') {
                                        firstList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                        secondList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                        thirdList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                    } else {
                                        firstList.data.push({
                                            x: new Date(el?.time_stamp).getTime(),
                                            y: el?.data?.Volts_A_N,
                                        });
                                        secondList.data.push({
                                            x: new Date(el?.time_stamp).getTime(),
                                            y: el?.data?.Volts_B_N,
                                        });
                                        thirdList.data.push({
                                            x: new Date(el?.time_stamp).getTime(),
                                            y: el?.data?.Volts_C_N,
                                        });
                                    }
                                });

                                recordToInsert = [firstList, secondList, thirdList];
                            }
                        }
                        setSensorChartData(recordToInsert);
                    }
                }
                setFetchingChartData(false);
            })
            .catch(() => {
                setFetchingChartData(false);
            });
    };

    const fetchSensorsYtdData = async (start_date, end_date, sensor_obj) => {
        if (!sensor_obj?.id) return;

        const payload = {
            sensor_id: sensor_obj?.id,
            bldg_id: bldgId,
            date_from: encodeURIComponent(start_date),
            date_to: encodeURIComponent(end_date),
            tz_info: timeZone,
            metric: `energy`,
        };

        await getSensorMetricYtdData(payload)
            .then((res) => {
                const response = res?.data;
                if (response?.success) setSensorYtdData(response?.data);
            })
            .catch(() => {});
    };

    useEffect(() => {
        fetchSensorsChartData(selectedConsumption, startDate, endDate, sensorObj);
    }, [startDate, endDate, selectedConsumption, sensorObj]);

    useEffect(() => {
        fetchSensorsYtdData(startDate, endDate, sensorObj);
    }, [startDate, endDate, sensorObj]);

    useEffect(() => {
        if (!utilityMeterObj?.id) return;
        utilityMeterObj?.device_type === UTILITY_MONITOR.PULSE_COUNTER
            ? setMetric(pulseChartMetrics)
            : setMetric(shadowChartMetrics);
    }, [utilityMeterObj]);

    return (
        <React.Fragment>
            <Row>
                <Col lg={4}>
                    <div className="device-detail-container d-flex justify-content-between">
                        <div className="w-50">
                            <Typography.Subheader className="gray-550" size={Typography.Sizes.md}>
                                {`Total YTD`}
                            </Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <div className="d-flex align-items-baseline">
                                <Typography.Header className="mr-1" size={Typography.Sizes.lg}>
                                    {sensorYtdData?.sum ? formatConsumptionValue(sensorYtdData?.sum / 1000, 0) : 0}
                                </Typography.Header>
                                <Typography.Subheader size={Typography.Sizes.sm}>
                                    <span> {`kWh`} </span>
                                </Typography.Subheader>
                            </div>
                        </div>

                        {utilityMeterObj?.device_type !== UTILITY_MONITOR.PULSE_COUNTER && (
                            <div className="w-50">
                                <Typography.Subheader className="gray-550" size={Typography.Sizes.md}>
                                    {`Peak kW YTD`}
                                </Typography.Subheader>
                                <Brick sizeInRem={0.25} />
                                <div className="d-flex align-items-baseline">
                                    <Typography.Header size={Typography.Sizes.lg} className="mr-1">
                                        {sensorYtdData?.peak?.consumption
                                            ? formatConsumptionValue(sensorYtdData?.peak?.consumption / 1000, 0)
                                            : 0}
                                    </Typography.Header>
                                    <Typography.Subheader size={Typography.Sizes.sm}>
                                        <span> {`kW`} </span>
                                    </Typography.Subheader>
                                </div>
                                <Brick sizeInRem={0.15} />
                                <Typography.Subheader size={Typography.Sizes.sm}>
                                    {sensorYtdData?.peak?.time_stamp &&
                                        `@ ${moment
                                            .utc(sensorYtdData?.peak?.time_stamp)
                                            .clone()
                                            .tz(timeZone)
                                            .format(
                                                `${userPrefDateFormat === `DD-MM-YYYY` ? `DD/MM` : `MM/DD`} ${
                                                    userPrefTimeFormat === `12h` ? `hh:mm A` : `HH:mm`
                                                }`
                                            )}`}
                                </Typography.Subheader>
                            </div>
                        )}
                    </div>

                    <Brick sizeInRem={2} />

                    <DeviceDetails utilityMeterObj={utilityMeterObj} />
                </Col>

                <Col lg={8}>
                    <div>
                        <div className="model-sensor-filters-v2 mb-3" style={{ padding: '0rem' }}>
                            <div className="d-flex">
                                <div className="mr-2">
                                    <Select
                                        defaultValue={selectedConsumption}
                                        options={metric}
                                        onChange={(e) => {
                                            handleUnitChange(e.value);
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                className="btn-group custom-button-group header-widget-styling"
                                role="group"
                                aria-label="Basic example">
                                <Header type="modal" />
                            </div>
                        </div>

                        {fetchingChartData ? (
                            <div className="chart-custom-loader">
                                <Spinner color="primary" />
                            </div>
                        ) : (
                            <div>
                                <LineChart
                                    title={''}
                                    subTitle={''}
                                    tooltipUnit={selectedUnit}
                                    tooltipLabel={selectedConsumptionLabel}
                                    data={sensorChartData}
                                    // dateRange={fetchDateRange(startDate, endDate)}
                                    chartProps={{
                                        tooltip: {
                                            xDateFormat: dateTimeFormatForHighChart(
                                                userPrefDateFormat,
                                                userPrefTimeFormat
                                            ),
                                        },
                                        xAxis: {
                                            type: 'datetime',
                                            labels: {
                                                format: formatXaxisForHighCharts(
                                                    daysCount,
                                                    userPrefDateFormat,
                                                    userPrefTimeFormat
                                                ),
                                            },
                                            gridLineWidth: null,
                                            alternateGridColor: null,
                                        },
                                        yAxis: {
                                            gridLineWidth: 1,
                                        },
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

const ConfigureTab = (props) => {
    const { sensorObj, handleChange, locationsList, sensorErrorObj, isFetchingLocations, utilityMeterObj } = props;
    const [buildingListData] = useAtom(buildingData);
    const [bldgName, setBldgName] = useState('');

    const LocationToolTip = () => {
        return (
            <div>
                <UncontrolledTooltip placement="bottom" target={'tooltip-for-location'}>
                    {`Utility Monitors are associated with the building by default. If this is a sub-meter or tenant metering application, please select a location from the dropdown.`}
                </UncontrolledTooltip>

                <button type="button" className="tooltip-button" id={'tooltip-for-location'}>
                    <TooltipIcon className="tooltip-icon" />
                </button>
            </div>
        );
    };

    const BuildingMeterToolTip = () => {
        return (
            <div>
                <UncontrolledTooltip placement="bottom" target={'tooltip-for-bldg-meter'}>
                    {`Select the Building Meter checkbox if this sensor is monitoring a building utility pulse input. Checking this box will include this sensor’s data in total building calculations.`}
                </UncontrolledTooltip>

                <button type="button" className="tooltip-button" id={'tooltip-for-bldg-meter'}>
                    <TooltipIcon className="tooltip-icon" />
                </button>
            </div>
        );
    };

    const resetLocationforSensor = () => {
        handleChange('service_location', 'null');
    };

    useEffect(() => {
        const obj = buildingListData.find((el) => el?.building_id === sensorObj?.building_id);
        if (obj?.building_id) setBldgName(obj?.building_name);
    }, [buildingListData, sensorObj]);

    return (
        <React.Fragment>
            <div className="d-flex w-100 form-gap">
                <div className="w-100">
                    <Typography.Body size={Typography.Sizes.md}>{`Utility Provider`}</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <InputTooltip
                        placeholder="Enter utility provider"
                        onChange={(e) => {
                            handleChange('utility_provider', e.target.value);
                        }}
                        labelSize={Typography.Sizes.md}
                        value={sensorObj?.utility_provider}
                        error={sensorErrorObj?.utility_provider}
                    />
                </div>

                <div className="w-100">
                    <Typography.Body size={Typography.Sizes.md}>{`Utility Meter S/N`}</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <InputTooltip
                        placeholder="Enter serial number for utility meter"
                        onChange={(e) => {
                            handleChange('utility_meter_serial_number', e.target.value);
                        }}
                        labelSize={Typography.Sizes.md}
                        value={sensorObj?.utility_meter_serial_number}
                        error={sensorErrorObj?.utility_meter_serial_number}
                    />
                </div>
            </div>

            <Brick sizeInRem={2} />

            {utilityMeterObj?.device_type === UTILITY_MONITOR.PULSE_COUNTER ? (
                <>
                    <div className="d-flex w-100 form-gap">
                        <div className="w-100">
                            <Typography.Body size={Typography.Sizes.md}>
                                {`Pulse Weight`}
                                <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                                    *
                                </span>
                            </Typography.Body>
                            <Brick sizeInRem={0.25} />
                            <InputTooltip
                                type="number"
                                placeholder="Enter pulse weight"
                                onChange={(e) => {
                                    handleChange('pulse_weight', e.target.value);
                                }}
                                labelSize={Typography.Sizes.md}
                                value={sensorObj?.pulse_weight}
                                error={sensorErrorObj?.pulse_weight}
                                inputClassName={'custom-input-field'}
                            />
                        </div>

                        <div className="w-100">
                            <Typography.Body size={Typography.Sizes.md}>{`Utility Meter Make`}</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            <InputTooltip
                                placeholder="Enter utility meter make"
                                onChange={(e) => {
                                    handleChange('utility_meter_make', e.target.value);
                                }}
                                labelSize={Typography.Sizes.md}
                                value={sensorObj?.utility_meter_make}
                            />
                        </div>
                    </div>

                    <Brick sizeInRem={2} />

                    <div className="d-flex w-100 form-gap">
                        <div className="w-100">
                            <Typography.Body size={Typography.Sizes.md}>{`Building`}</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            <InputTooltip
                                placeholder="Enter building name"
                                labelSize={Typography.Sizes.md}
                                value={bldgName}
                                disabled={true}
                            />
                            <Brick sizeInRem={0.25} />
                            <div className="d-flex align-items-center">
                                <Checkbox label="Building Meter" size={Checkbox.Sizes.sm} disabled={false} />
                                <BuildingMeterToolTip />
                            </div>
                        </div>

                        <div className="w-100">
                            <Typography.Body size={Typography.Sizes.md}>{`Utility Meter Model`}</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            <InputTooltip
                                placeholder="Enter utility meter model"
                                onChange={(e) => {
                                    handleChange('utility_meter_model', e.target.value);
                                }}
                                labelSize={Typography.Sizes.md}
                                value={sensorObj?.utility_meter_model}
                            />
                        </div>
                    </div>

                    <Brick sizeInRem={2} />

                    <div className="d-flex form-gap">
                        <div className="w-100">
                            <div className="d-flex align-items-center">
                                <Typography.Body size={Typography.Sizes.md}>{`Submeter Location`}</Typography.Body>
                                <LocationToolTip />
                            </div>
                            <Brick sizeInRem={0.25} />
                            {isFetchingLocations ? (
                                <Skeleton count={1} height={35} />
                            ) : (
                                <>
                                    <Select
                                        placeholder="Select Location"
                                        options={locationsList}
                                        currentValue={locationsList.filter(
                                            (option) => option.value === sensorObj?.service_location
                                        )}
                                        onChange={(e) => {
                                            handleChange('service_location', e.value);
                                        }}
                                        isSearchable={true}
                                    />
                                    {sensorObj?.service_location ? (
                                        <>
                                            <Brick sizeInRem={0.25} />
                                            <Typography.Body
                                                size={Typography.Sizes.xs}
                                                className="input-error-label text-primary font-bold float-right mouse-pointer"
                                                onClick={resetLocationforSensor}>
                                                {`Reset Submeter Location`}
                                            </Typography.Body>
                                        </>
                                    ) : null}
                                </>
                            )}
                        </div>
                        <div className="w-100" />
                    </div>
                </>
            ) : (
                <>
                    <div className="d-flex w-100 form-gap">
                        <div className="w-100">
                            <Typography.Body size={Typography.Sizes.md}>{`Utility Meter Make`}</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            <InputTooltip
                                placeholder="Enter utility meter make"
                                onChange={(e) => {
                                    handleChange('utility_meter_make', e.target.value);
                                }}
                                labelSize={Typography.Sizes.md}
                                value={sensorObj?.utility_meter_make}
                            />
                        </div>

                        <div className="w-100">
                            <Typography.Body size={Typography.Sizes.md}>{`Utility Meter Model`}</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            <InputTooltip
                                placeholder="Enter utility meter model"
                                onChange={(e) => {
                                    handleChange('utility_meter_model', e.target.value);
                                }}
                                labelSize={Typography.Sizes.md}
                                value={sensorObj?.utility_meter_model}
                            />
                        </div>
                    </div>

                    <Brick sizeInRem={2} />

                    <div className="d-flex w-100 form-gap">
                        <div className="w-100">
                            <Typography.Body size={Typography.Sizes.md}>{`Building`}</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            <InputTooltip
                                placeholder="Enter building name"
                                labelSize={Typography.Sizes.md}
                                value={bldgName}
                                disabled={true}
                            />
                            <Brick sizeInRem={0.25} />
                            <div className="d-flex align-items-center">
                                <Checkbox label="Building Meter" size={Checkbox.Sizes.sm} disabled={false} />
                                <BuildingMeterToolTip />
                            </div>
                        </div>

                        <div className="w-100">
                            <div className="d-flex align-items-center">
                                <Typography.Body size={Typography.Sizes.md}>Submeter Location</Typography.Body>
                                <LocationToolTip />
                            </div>
                            <Brick sizeInRem={0.25} />
                            {isFetchingLocations ? (
                                <Skeleton count={1} height={35} />
                            ) : (
                                <>
                                    <Select
                                        placeholder="Select Location"
                                        options={locationsList}
                                        currentValue={locationsList.filter(
                                            (option) => option.value === sensorObj?.service_location
                                        )}
                                        onChange={(e) => {
                                            handleChange('service_location', e.value);
                                        }}
                                        isSearchable={true}
                                    />
                                    {sensorObj?.service_location ? (
                                        <>
                                            <Brick sizeInRem={0.25} />
                                            <Typography.Body
                                                size={Typography.Sizes.xs}
                                                className="input-error-label text-primary font-bold float-right mouse-pointer"
                                                onClick={resetLocationforSensor}>
                                                {`Reset Submeter Location`}
                                            </Typography.Body>
                                        </>
                                    ) : null}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}

            <Brick sizeInRem={2} />
        </React.Fragment>
    );
};

const EditUtilitySensor = (props) => {
    const {
        showModal,
        closeModal,
        activeTab,
        setActiveTab,
        selectedSensorObj,
        utilityMeterObj,
        fetchUtilityMeterSensors,
        bldgId,
        deviceId,
    } = props;

    const defaultSensorError = {
        utility_provider: null,
        utility_meter_serial_number: null,
        pulse_weight: null,
    };

    const [sensorObj, setSensorObj] = useState(null);
    const [sensorErrorObj, setSensorErrorObj] = useState(defaultSensorError);
    const [isSensorUpdating, setSensorUpdating] = useState(false);

    const handleConfigChange = (key, value) => {
        let obj = Object.assign({}, sensorObj);
        let errorObj = Object.assign({}, sensorErrorObj);
        obj[key] = value;
        errorObj[key] = null;
        setSensorObj(obj);
        setSensorErrorObj(errorObj);
    };

    const updateUtilitySensorData = async () => {
        let alertObj = Object.assign({}, sensorErrorObj);

        if (utilityMeterObj?.device_type === UTILITY_MONITOR.PULSE_COUNTER && sensorObj?.pulse_weight.length === 0) {
            alertObj.pulse_weight = 'Please enter pulse weight. It cannot be empty.';
        }

        setSensorErrorObj(alertObj);

        if (!alertObj.pulse_weight) {
            setSensorUpdating(true);

            const payload = {
                utility_provider: sensorObj?.utility_provider,
                utility_meter_make: sensorObj?.utility_meter_make,
                utility_meter_model: sensorObj?.utility_meter_model,
                utility_meter_serial_number: sensorObj?.utility_meter_serial_number,
            };

            if (sensorObj?.service_location !== '') payload.service_location = sensorObj?.service_location;
            if (utilityMeterObj?.device_type === UTILITY_MONITOR.PULSE_COUNTER)
                payload.pulse_weight = sensorObj?.pulse_weight;

            const params = `?sensor_id=${sensorObj?.id}`;

            await updateUtilitySensorServices(params, payload)
                .then((res) => {
                    const response = res?.data;
                    if (response?.success) {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = response?.message;
                            s.notificationType = 'success';
                        });
                        fetchUtilityMeterSensors(bldgId, deviceId);
                        closeModal();
                    } else {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = response?.message
                                ? response?.message
                                : res
                                ? 'Unable to update Utility Monitor sensor.'
                                : 'Unable to Utility Monitor sensor due to Internal Server Error!.';
                            s.notificationType = 'error';
                        });
                    }
                    setSensorUpdating(false);
                })
                .catch((e) => {
                    setSensorUpdating(false);
                    closeModal();
                });
        }
    };

    useEffect(() => {
        if (!showModal) {
            setSensorObj(null);
            setSensorErrorObj(defaultSensorError);
        }
    }, [showModal]);

    useEffect(() => {
        if (selectedSensorObj?.id) setSensorObj(selectedSensorObj);
    }, [selectedSensorObj]);

    return (
        <React.Fragment>
            <Modal show={showModal} onHide={closeModal} size="xl" centered backdrop="static" keyboard={false}>
                <div>
                    <div
                        className="passive-header-wrapper d-flex justify-content-between"
                        style={{ background: 'none' }}>
                        <div className="d-flex flex-column justify-content-between">
                            {utilityMeterObj?.mac_address && (
                                <Typography.Subheader size={Typography.Sizes.sm}>
                                    {`${utilityMeterObj?.model} - ${convertToMac(utilityMeterObj?.mac_address)}`}
                                </Typography.Subheader>
                            )}
                            <Typography.Header size={Typography.Sizes.md}>
                                {activeTab === 'metrics'
                                    ? utilityMeterObj?.device_type === UTILITY_MONITOR.PULSE_COUNTER
                                        ? formatSensorHeading(selectedSensorObj, 'pulse')
                                        : formatSensorHeading(selectedSensorObj, 'shadow')
                                    : `Sensor Details`}
                            </Typography.Header>
                            <div className="d-flex justify-content-start mouse-pointer ">
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    className={`typography-wrapper mr-4 ${
                                        activeTab === 'metrics' ? 'active-tab-style' : ''
                                    }`}
                                    onClick={() => setActiveTab('metrics')}>
                                    {`Metrics`}
                                </Typography.Subheader>

                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    className={`typography-wrapper ${
                                        activeTab === 'configure' ? 'active-tab-style' : ''
                                    }`}
                                    onClick={() => setActiveTab('configure')}>
                                    {`Configure`}
                                </Typography.Subheader>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div>
                                <Button
                                    label="Cancel"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryGrey}
                                    onClick={closeModal}
                                />
                            </div>

                            <div>
                                <Button
                                    label={isSensorUpdating ? `Saving ...` : `Save`}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={updateUtilitySensorData}
                                    className="ml-2"
                                    disabled={compareObjData(selectedSensorObj, sensorObj) || isSensorUpdating}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-default">
                        {activeTab === 'metrics' && (
                            <MetricsTab utilityMeterObj={utilityMeterObj} sensorObj={sensorObj} {...props} />
                        )}

                        {activeTab === 'configure' && (
                            <ConfigureTab
                                sensorObj={sensorObj}
                                handleChange={handleConfigChange}
                                sensorErrorObj={sensorErrorObj}
                                {...props}
                            />
                        )}
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default EditUtilitySensor;
