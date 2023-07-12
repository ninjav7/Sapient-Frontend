import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import { useAtom } from 'jotai';
import { buildingData } from '../../../store/globalState';
import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import colorPalette from '../../../assets/scss/_colors.scss';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { DeviceDetails } from './IndividualUtilityMeter';
import LineChart from '../../../sharedComponents/lineChart/LineChart';
import Select from '../../../sharedComponents/form/select';
import { fetchDateRange } from '../../../helpers/formattedChartData';
import Header from '../../../components/Header';
import { DateRangeStore } from '../../../store/DateRangeStore';
import { lineChartMock } from './mock';
import { convertToMac } from './utils';
import { compareObjData } from '../../../helpers/helpers';
import { updateUtilitySensorServices } from './services';
import { UserStore } from '../../../store/UserStore';
import './styles.scss';

const MetricsTab = (props) => {
    const { utilityMeterObj } = props;

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));

    const [metric, setMetric] = useState([
        { value: 'minCurrentMilliAmps', label: 'Minimum Current (mA)', unit: 'mA', Consumption: 'Minimum Current' },
        { value: 'maxCurrentMilliAmps', label: 'Maximum Current (mA)', unit: 'mA', Consumption: 'Maximum Current' },
        { value: 'rmsCurrentMilliAmps', label: 'RMS Current (mA)', unit: 'mA', Consumption: 'RMS Current' },
        { value: 'power', label: 'Power (W)', unit: 'W', Consumption: 'Power' },
    ]);

    const [selectedUnit, setSelectedUnit] = useState(metric[2].unit);
    const [selectedConsumption, setConsumption] = useState(metric[2].value);
    const [selectedConsumptionLabel, setSelectedConsumptionLabel] = useState(metric[2].Consumption);

    const handleUnitChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedUnit(obj.unit);
        setSelectedConsumptionLabel(obj.Consumption);
    };

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
                            <Typography.Header className="d-inline-block mr-1" size={Typography.Sizes.lg}>
                                {`84,223`}
                            </Typography.Header>
                            <Typography.Subheader className="d-inline-block" size={Typography.Sizes.sm}>
                                <span> {`kWh`} </span>
                            </Typography.Subheader>
                        </div>

                        <div className="w-50">
                            <Typography.Subheader className="gray-550" size={Typography.Sizes.md}>
                                {`Peak kW YTD`}
                            </Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <Typography.Header className="d-inline-block mr-1" size={Typography.Sizes.lg}>
                                {`194`}
                            </Typography.Header>
                            <Typography.Subheader className="d-inline-block" size={Typography.Sizes.sm}>
                                <span>{`kWh @ 9/23 14:24`}</span>
                            </Typography.Subheader>
                        </div>
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
                                            if (e.value === 'passive-power') {
                                                return;
                                            }
                                            setConsumption(e.value);
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

                        <div>
                            <LineChart
                                title={''}
                                subTitle={''}
                                tooltipUnit={selectedUnit}
                                tooltipLabel={selectedConsumptionLabel}
                                data={lineChartMock}
                                dateRange={fetchDateRange(startDate, endDate)}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

const ConfigureTab = (props) => {
    const { sensorObj, handleChange, locationsList } = props;
    const [buildingListData] = useAtom(buildingData);
    const [bldgName, setBldgName] = useState('');

    useEffect(() => {
        const obj = buildingListData.find((el) => el?.building_id === sensorObj?.building_id);
        if (obj?.building_id) setBldgName(obj?.building_name);
    }, [buildingListData, sensorObj]);

    return (
        <React.Fragment>
            <div className="d-flex w-100 form-gap">
                <div className="w-100">
                    <Typography.Body size={Typography.Sizes.md}>
                        {`Utility Provider`}
                        <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                            *
                        </span>
                    </Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <InputTooltip
                        placeholder="Enter utility provider"
                        onChange={(e) => {
                            handleChange('utility_provider', e.target.value);
                        }}
                        labelSize={Typography.Sizes.md}
                        value={sensorObj?.utility_provider}
                    />
                </div>

                <div className="w-100">
                    <Typography.Body size={Typography.Sizes.md}>
                        {`Utility Meter S/N`}
                        <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                            *
                        </span>
                    </Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <InputTooltip
                        type="number"
                        placeholder="Enter serial number for utility meter"
                        onChange={(e) => {
                            handleChange('utility_meter_serial_number', e.target.value);
                        }}
                        labelSize={Typography.Sizes.md}
                        value={sensorObj?.utility_meter_serial_number}
                    />
                </div>
            </div>

            <Brick sizeInRem={2} />

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
                </div>

                <div className="w-100">
                    <Typography.Body size={Typography.Sizes.md}>Submeter Location</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Location"
                        options={locationsList}
                        defaultValue={locationsList.filter((option) => option.value === sensorObj?.service_location)}
                        onChange={(e) => {
                            handleChange('service_location', e.value);
                        }}
                        isSearchable={true}
                    />
                </div>
            </div>

            <Brick sizeInRem={2} />

            <div className="d-flex form-gap">
                <div className="w-100">
                    <Typography.Body size={Typography.Sizes.md}>{`Utility Meter Modal`}</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <InputTooltip
                        placeholder="Enter utility meter modal"
                        onChange={(e) => {
                            handleChange('utility_meter_model', e.target.value);
                        }}
                        labelSize={Typography.Sizes.md}
                        value={sensorObj?.utility_meter_model}
                    />
                </div>
                <div className="w-100" />
            </div>

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
        obj[key] = value;
        setSensorObj(obj);
    };

    const updateUtilitySensorData = async () => {
        setSensorUpdating(true);

        const payload = {
            pulse_weight: sensorObj?.pulse_weight,
            utility_provider: sensorObj?.utility_provider,
            utility_meter_make: sensorObj?.utility_meter_make,
            utility_meter_model: sensorObj?.utility_meter_model,
            utility_meter_serial_number: sensorObj?.utility_meter_serial_number,
            service_location: sensorObj?.service_location,
        };

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
                            ? 'Unable to update utility meter sensor.'
                            : 'Unable to utility meter sensor due to Internal Server Error!.';
                        s.notificationType = 'error';
                    });
                }
                setSensorUpdating(false);
            })
            .catch((e) => {
                setSensorUpdating(false);
                closeModal();
            });
    };

    useEffect(() => {
        if (!showModal) setSensorObj(null);
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
                                {activeTab === 'metrics' ? `TECO - 54632136854 - 1.2 kWH/pulse` : `Sensor Details`}
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
                        {activeTab === 'metrics' && <MetricsTab utilityMeterObj={utilityMeterObj} />}

                        {activeTab === 'configure' && (
                            <ConfigureTab sensorObj={sensorObj} handleChange={handleConfigChange} {...props} />
                        )}
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default EditUtilitySensor;
