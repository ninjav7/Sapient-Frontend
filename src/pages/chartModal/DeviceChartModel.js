import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Spinner } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { BaseUrl, sensorGraphData } from '../../services/Network';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import Header from '../../components/Header';
import { apiRequestBody } from '../../helpers/helpers';
import '../../pages/portfolio/style.scss';
import './style.css';
import Select from '../../sharedComponents/form/select';
import LineChart from '../../sharedComponents/lineChart/LineChart';
import { fetchDateRange } from '../../helpers/formattedChartData';
import Typography from '../../sharedComponents/typography';

const DeviceChartModel = ({
    showChart,
    handleChartClose,
    sensorData,
    seriesData,
    setSeriesData,
    deviceData,
    setDeviceData,
    CONVERSION_ALLOWED_UNITS,
    UNIT_DIVIDER,
    metric,
    selectedConsumption,
    setConsumption,
    selectedConsumptionLabel,
    setSelectedConsumptionLabel,
    getRequiredConsumptionLabel,
    isSensorChartLoading,
    setIsSensorChartLoading,
    timeZone,
    selectedUnit,
    setSelectedUnit,
    daysCount,
    deviceType,
}) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [dropDown, setDropDown] = useState('dropdown-menu dropdown-menu-right');

    const handleRefresh = () => {
        setDeviceData([]);
        setSeriesData([]);
        if (deviceType === 'active') {
            setSelectedUnit(metric[0].unit);
            setConsumption(metric[0].value);
            setSelectedConsumptionLabel(metric[0].Consumption);
        }
        if (deviceType === 'passive') {
            setSelectedUnit(metric[2].unit);
            setConsumption(metric[2].value);
            setSelectedConsumptionLabel(metric[2].Consumption);
        }
    };

    const handleShow = () => {
        if (dropDown === 'dropdown-menu dropdown-menu-right') setDropDown('dropdown-menu dropdown-menu-right show');
        else setDropDown('dropdown-menu dropdown-menu-right');
    };

    const removeDuplicates = (arr = []) => {
        const map = new Map();
        arr.forEach((x) => map.set(JSON.stringify(x), x));
        arr = [...map.values()];
        return arr;
    };

    const getCSVLinkData = () => {
        let arr = seriesData.length > 0 ? seriesData[0].data : [];
        let sData = removeDuplicates(arr);
        let streamData = seriesData.length > 0 ? seriesData[0].data : [];
        return [['timestamp', selectedConsumption], ...streamData];
    };

    const handleUnitChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedUnit(obj.unit);
        setSelectedConsumptionLabel(obj.Consumption);
    };

    useEffect(() => {
        if (startDate === null) {
            return;
        }

        if (endDate === null) {
            return;
        }

        const exploreDataFetch = async () => {
            try {
                if (sensorData.id === undefined) {
                    return;
                }
                if (!showChart) {
                    return;
                }
                setIsSensorChartLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?sensor_id=${sensorData.id}&consumption=${selectedConsumption}&building_id=${bldgId}`;
                await axios
                    .post(`${BaseUrl}${sensorGraphData}${params}`, apiRequestBody(startDate, endDate, timeZone), {
                        headers,
                    })
                    .then((res) => {
                        setDeviceData([]);
                        setSeriesData([]);
                        let response = res.data;
                        let data = response;

                        let NulledData = [];
                        data.map((ele) => {
                            if (ele?.consumption === '') {
                                NulledData.push({ x: moment.utc(new Date(ele?.time_stamp)), y: null });
                            } else {
                                if (CONVERSION_ALLOWED_UNITS.indexOf(selectedConsumption) > -1) {
                                    NulledData.push({
                                        x: moment.utc(new Date(ele.time_stamp)),
                                        y: ele.consumption / UNIT_DIVIDER,
                                    });
                                } else {
                                    NulledData.push({
                                        x: moment.utc(new Date(ele.time_stamp)),
                                        y: ele.consumption,
                                    });
                                }
                            }
                        });
                        let recordToInsert = {
                            data: NulledData,
                            name: getRequiredConsumptionLabel(selectedConsumption),
                        };
                        setDeviceData([recordToInsert]);

                        setIsSensorChartLoading(false);
                    });
            } catch (error) {
                setIsSensorChartLoading(false);
            }
        };
        exploreDataFetch();
    }, [startDate, endDate, selectedConsumption]);

    return (
        <Modal show={showChart} size="xl" centered backdrop="static" keyboard={false}>
            <div className="chart-model-header">
                <div>
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        Type={Typography.Types.Light}
                        className="model-sensor-date-time">
                        {localStorage.getItem('identifier')}
                    </Typography.Subheader>
                    <div className="chart-model-subheader">
                        <Typography.Header size={Typography.Sizes.md}>{sensorData.name}</Typography.Header>
                        <Typography.Subheader size={Typography.Sizes.md} className="chart-model-title">
                            {sensorData.equipment}
                        </Typography.Subheader>
                    </div>
                </div>

                <div>
                    <FontAwesomeIcon
                        icon={faXmark}
                        size="lg"
                        onClick={() => {
                            handleChartClose();
                            handleRefresh();
                        }}
                    />
                </div>
            </div>

            <div className="model-sensor-filters-v2">
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

            {isSensorChartLoading ? (
                <div className="loader-center-style">
                    <Spinner className="m-2" color={'primary'} />
                </div>
            ) : (
                <div className="p-4">
                    <LineChart
                        title={''}
                        subTitle={''}
                        tooltipUnit={selectedUnit}
                        tooltipLabel={selectedConsumptionLabel}
                        data={deviceData}
                        dateRange={fetchDateRange(startDate, endDate)}
                    />
                </div>
            )}
        </Modal>
    );
};

export default DeviceChartModel;
