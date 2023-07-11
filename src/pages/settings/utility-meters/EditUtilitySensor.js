import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
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
import { deviceData } from './utils';
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
                                data={deviceData}
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
    const { utilityMeterConfig, handleChange } = props;

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
                        value={utilityMeterConfig?.utility_provider}
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
                            handleChange('serial_number', e.target.value);
                        }}
                        labelSize={Typography.Sizes.md}
                        value={utilityMeterConfig?.serial_number}
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
                        value={utilityMeterConfig?.pulse_weight}
                    />
                </div>

                <div className="w-100">
                    <Typography.Body size={Typography.Sizes.md}>{`Utility Meter Make`}</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <InputTooltip
                        placeholder="Enter utility meter make"
                        onChange={(e) => {
                            handleChange('utility_make', e.target.value);
                        }}
                        labelSize={Typography.Sizes.md}
                        value={utilityMeterConfig?.utility_make}
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
                            handleChange('utility_model', e.target.value);
                        }}
                        labelSize={Typography.Sizes.md}
                        value={utilityMeterConfig?.utility_model}
                    />
                </div>
                <div className="w-100" />
            </div>

            <Brick sizeInRem={2} />
        </React.Fragment>
    );
};

const EditUtilitySensor = (props) => {
    const { showModal, closeModal, activeTab, setActiveTab, selectedSensorObj, utilityMeterObj } = props;

    const defaultUtilityMeterConfig = {
        utility_provider: '',
        serial_number: '',
        pulse_weight: '',
        utility_make: '',
        utility_model: '',
    };

    const [sensorObj, setSensorObj] = useState(null);
    const [utilityMeterConfig, setUtilityMeterConfig] = useState(defaultUtilityMeterConfig);

    const handleConfigChange = (key, value) => {
        let obj = Object.assign({}, utilityMeterConfig);
        obj[key] = value;
        setUtilityMeterConfig(obj);
    };

    useEffect(() => {
        if (!showModal) {
            setUtilityMeterConfig(defaultUtilityMeterConfig);
            setSensorObj(null);
        }
    }, [showModal]);

    useEffect(() => {
        if (selectedSensorObj?.sensor_id) setSensorObj(selectedSensorObj);
    }, [selectedSensorObj]);

    return (
        <React.Fragment>
            <Modal show={showModal} onHide={closeModal} size="xl" centered backdrop="static" keyboard={false}>
                <div>
                    <div
                        className="passive-header-wrapper d-flex justify-content-between"
                        style={{ background: 'none' }}>
                        <div className="d-flex flex-column justify-content-between">
                            <Typography.Subheader size={Typography.Sizes.sm}>
                                {`Sapient Pulse - CD:12:CD:12:CD:12`}
                            </Typography.Subheader>
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
                                    label={'Save'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={closeModal}
                                    className="ml-2"
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-default">
                        {activeTab === 'metrics' && <MetricsTab utilityMeterObj={utilityMeterObj} />}

                        {activeTab === 'configure' && (
                            <ConfigureTab utilityMeterConfig={utilityMeterConfig} handleChange={handleConfigChange} />
                        )}
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default EditUtilitySensor;
