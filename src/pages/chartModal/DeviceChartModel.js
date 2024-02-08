import React, { useEffect, useState } from 'react';
import { Spinner, Modal } from 'reactstrap';
import 'moment-timezone';
import { BaseUrl, sensorGraphData } from '../../services/Network';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import Header from '../../components/Header';
import { handleAPIRequestBody, dateTimeFormatForHighChart, formatXaxisForHighCharts } from '../../helpers/helpers';
import Select from '../../sharedComponents/form/select';
import LineChart from '../../sharedComponents/lineChart/LineChart';
import { fetchDateRange } from '../../helpers/formattedChartData';
import Typography from '../../sharedComponents/typography';
import { Button } from '../../sharedComponents/button';
import { UserStore } from '../../store/UserStore';
import Brick from '../../sharedComponents/brick';
import '../../pages/portfolio/style.scss';
import './style.css';
import './styles.scss';

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

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);
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
                    .post(`${BaseUrl}${sensorGraphData}${params}`, handleAPIRequestBody(startDate, endDate, timeZone), {
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
                                NulledData.push({ x: new Date(ele?.time_stamp).getTime(), y: null });
                            } else {
                                if (CONVERSION_ALLOWED_UNITS.indexOf(selectedConsumption) > -1) {
                                    NulledData.push({
                                        x: new Date(ele.time_stamp).getTime(),
                                        y: ele.consumption / UNIT_DIVIDER,
                                    });
                                } else {
                                    NulledData.push({
                                        x: new Date(ele.time_stamp).getTime(),
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
        <Modal isOpen={showChart} className="modal-fullscreen">
            <div className="chart-model-header d-flex justify-content-between">
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
                    <Button
                        label="Close"
                        size={Button.Sizes.md}
                        type={Button.Type.secondaryGrey}
                        onClick={() => {
                            handleChartClose();
                            handleRefresh();
                        }}
                    />
                </div>
            </div>

            <Brick sizeInRem={2} />

            <div className="d-flex flex-row-reverse" style={{ paddingRight: '2rem', gap: '0.5rem' }}>
                <div
                    className="btn-group custom-button-group header-widget-styling"
                    role="group"
                    aria-label="Basic example">
                    <Header type="modal" />
                </div>

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

            <div style={{ padding: '1rem 2rem 2rem 2rem' }}>
                {isSensorChartLoading ? (
                    <div className="loader-center-style">
                        <Spinner color="primary" />
                    </div>
                ) : (
                    <LineChart
                        title={''}
                        subTitle={''}
                        tooltipUnit={selectedUnit}
                        tooltipLabel={selectedConsumptionLabel}
                        data={deviceData}
                        // dateRange={fetchDateRange(startDate, endDate)}
                        chartProps={{
                            tooltip: {
                                xDateFormat: dateTimeFormatForHighChart(userPrefDateFormat, userPrefTimeFormat),
                            },
                            xAxis: {
                                type: 'datetime',
                                labels: {
                                    format: formatXaxisForHighCharts(daysCount, userPrefDateFormat, userPrefTimeFormat),
                                },
                                gridLineWidth: null,
                                alternateGridColor: null,
                            },
                            yAxis: {
                                gridLineWidth: 1,
                            },
                        }}
                    />
                )}
            </div>
        </Modal>
    );
};

export default DeviceChartModel;
