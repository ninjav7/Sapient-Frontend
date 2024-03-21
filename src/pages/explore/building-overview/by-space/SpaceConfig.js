import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Modal, Spinner } from 'reactstrap';

import { UserStore } from '../../../../store/UserStore';
import { BuildingStore } from '../../../../store/BuildingStore';
import { DateRangeStore } from '../../../../store/DateRangeStore';

import Brick from '../../../../sharedComponents/brick';
import Header from '../../../../components/Header';
import Select from '../../../../sharedComponents/form/select';
import { Button } from '../../../../sharedComponents/button';
import Typography from '../../../../sharedComponents/typography';
import LineChart from '../../../../sharedComponents/lineChart/LineChart';

import ConfigurationTab from '../../../spaceDetails/configurationTab';
import MetadataContainer from '../../../spaceDetails/MetadataContainer';
import SpacesEquipmentTable from '../../../spaceDetails/SpacesEquipmentTable';
import EnergyMetadataContainer from '../../../spaceDetails/EnergyMetadataContainer';

import {
    fetchEnergyConsumptionBySpace,
    fetchEnergyConsumptionSpaceByCategory,
    fetchSpaceMetadata,
} from '../../../spaceDetails/services';
import { updateSpaceService } from '../../../settings/layout/services';

import { defaultMetrics } from '../../../spaceDetails/constants';
import { handleDataConversion } from '../../../spaceDetails/helper';
import { dateTimeFormatForHighChart, formatXaxisForHighCharts } from '../../../../helpers/helpers';

import '../../../spaceDetails/styles.scss';

const SpaceConfiguration = (props) => {
    const { showSpaceConfigModal = false, closeSpaceConfigModal, bldgId, spaceId, selectedSpaceObj = {} } = props;

    const metric = defaultMetrics;

    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [chartDataFetching, setChartDataFetching] = useState(false);
    const [chartData, setChartData] = useState([]);

    const [metadataFetching, setMetadataFetching] = useState(false);
    const [metadata, setMetadata] = useState({});

    const [selectedTab, setSelectedTab] = useState(0);

    const [selectedConsumption, setSelectedConsumption] = useState(metric[0]?.value);

    const [errorObj, setErrorObj] = useState({});

    const [selectedFloorId, setSelectedFloorId] = useState(null);
    const [spaceObj, setSpaceObj] = useState({});
    const [updateSpaceFetcing, setUpdateSpaceFetching] = useState(false);

    const allParentSpaces = useRef([]);

    const selectedMetricsTab = () => setSelectedTab(0);
    const selectedConfiguresTab = () => !metadataFetching && !chartDataFetching && setSelectedTab(1);
    const dynamicActiveClassTab = (selectedIdTab) => (selectedTab === selectedIdTab ? 'active-tab-style' : '');
    const handleSelect = (e) => setSelectedConsumption(e.value);
    const spaceName = metadata?.space_name && metadata.space_name;

    const chartProps = {
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
    };

    const mapChartData = async (query) => {
        const response = await fetchEnergyConsumptionBySpace(query);

        if (!Array.isArray(response)) return;

        const space = response[0];

        if (!Array.isArray(space?.total_data)) return;

        const mappedSpaceData = space.total_data.map((consumptionData) => ({
            x: new Date(consumptionData?.time_stamp).getTime(),
            y: handleDataConversion(consumptionData?.consumption, selectedConsumption),
        }));

        const spaceRecord = {
            name: space.space_name,
            data: mappedSpaceData,
        };

        setChartData([spaceRecord]);
    };

    const mapChartDataByCategory = async (query) => {
        const response = await fetchEnergyConsumptionBySpace(query);

        if (!Array.isArray(response)) return;

        const space = response[0];

        if (!Array.isArray(space?.total_data)) return;

        const mappedSpaceData = space.total_data.map((consumptionData) => ({
            x: new Date(consumptionData?.time_stamp).getTime(),
            y: handleDataConversion(consumptionData?.consumption, selectedConsumption),
        }));

        const spaceRecord = {
            name: space.space_name,
            data: mappedSpaceData,
        };

        const responseByCategory = await fetchEnergyConsumptionSpaceByCategory('by_equipment', query);

        const mappedEquipmentData = responseByCategory.map((equipmentData) => {
            const mappedConsumptionData = equipmentData.consumption.map((equipmentConsumptionData) => ({
                x: new Date(equipmentConsumptionData?.time_stamp).getTime(),
                y: handleDataConversion(equipmentConsumptionData?.consumption, selectedConsumption),
            }));

            const equipmentRecord = {
                name: equipmentData.equipment_name,
                data: mappedConsumptionData,
            };

            return equipmentRecord;
        });

        spaceRecord.name = 'Total';

        mappedEquipmentData.unshift(spaceRecord);

        setChartData(mappedEquipmentData);
    };

    const notifyUser = (notifyType, notifyMessage) => {
        UserStore.update((s) => {
            s.showNotification = true;
            s.notificationMessage = notifyMessage;
            s.notificationType = notifyType;
        });
    };

    const fetchChartData = async () => {
        setChartDataFetching(true);
        setChartData([]);

        try {
            const query = { spaceId, bldgId, dateFrom: startDate, dateTo: endDate, timeZone };

            const isEquipment = selectedConsumption === metric[1].value;

            if (isEquipment) {
                await mapChartDataByCategory(query);
            } else {
                await mapChartData(query);
            }
        } catch {
            setChartData([]);
        }

        setChartDataFetching(false);
    };

    const fetchMetadata = async () => {
        setMetadataFetching(true);
        setMetadata({});

        try {
            const query = { bldgId, dateFrom: startDate, dateTo: endDate, timeZone };

            const res = await fetchSpaceMetadata(query, spaceId);

            if (res) {
                setMetadata(res);
                setSelectedFloorId(res.floor_id);
            }
        } catch {
            setMetadata({});
        }

        setMetadataFetching(false);
    };

    const fetchEditSpace = async () => {
        setUpdateSpaceFetching(true);

        const params = `?space_id=${spaceObj?._id}`;

        const payload = {
            building_id: bldgId,
            name: spaceObj?.name,
            type_id: spaceObj?.type_id,
            square_footage: spaceObj?.square_footage ?? null,
            tags: spaceObj?.tags ?? [],
            parents: spaceObj?.new_parents ? spaceObj?.new_parents : spaceObj?.parents,
            parent_space:
                spaceObj?.new_parent_space || spaceObj?.new_parent_space === null
                    ? spaceObj?.new_parent_space
                    : spaceObj?.parent_space,
        };

        try {
            const axiosResponse = await updateSpaceService(params, payload);
            const response = axiosResponse?.data;

            if (response?.success) {
                notifyUser(Notification.Types.success, `Space updated successfully.`);
            } else {
                notifyUser(Notification.Types.error, response?.message);
            }
        } catch {
            notifyUser(Notification.Types.error, `Failed to update Space.`);
        }

        setUpdateSpaceFetching(false);
        allParentSpaces.current = [];
    };

    const handleEditSpace = () => {
        if (!bldgId || !spaceObj?._id) return;

        const alertObj = {};

        if (!spaceObj?.name || spaceObj?.name === '') alertObj.name = `Please enter Space name. It can not be empty.`;
        if (!spaceObj?.type_id || spaceObj?.type_id === '') alertObj.type_id = { text: `Please select Type.` };
        if (Number(spaceObj?.square_footage) < 0)
            alertObj.square_footage = { text: `Please enter Square footage from 0.` };

        setErrorObj(alertObj);

        if (!alertObj.name && !alertObj.type_id && Number(spaceObj.square_footage) >= 0) fetchEditSpace();
    };

    useEffect(() => {
        if (!spaceId || !selectedConsumption || !bldgId || !startDate || !endDate) return;

        fetchChartData();
        fetchMetadata();
    }, [spaceId, startDate, endDate, selectedConsumption, bldgId]);

    return (
        <Modal isOpen={showSpaceConfigModal} className="breaker-modal-fullscreen">
            <div style={{ padding: '2rem' }}>
                <Row>
                    <Col lg={12}>
                        <div className="passive-header-wrapper d-flex justify-content-between upper-content-container">
                            <div className="d-flex flex-column justify-content-between">
                                <Typography.Header size={Typography.Sizes.md}>{spaceName}</Typography.Header>
                                <div className="d-flex justify-content-start mouse-pointer ">
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        className={`typography-wrapper mr-4 ${dynamicActiveClassTab(0)}`}
                                        onClick={selectedMetricsTab}>
                                        Metrics
                                    </Typography.Subheader>
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        className={`typography-wrapper ${dynamicActiveClassTab(1)}`}
                                        onClick={selectedConfiguresTab}>
                                        Configure
                                    </Typography.Subheader>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <Button
                                    label={updateSpaceFetcing ? 'Saving' : 'Save'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={handleEditSpace}
                                    className="mr-2"
                                    disabled={updateSpaceFetcing}
                                />
                                <Button
                                    label="Close"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryGrey}
                                    // onClick={() => history.push(`/spaces/building/overview/${bldgId}`)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>

                {selectedTab === 0 && (
                    <div className="lower-content-container">
                        <Row>
                            <Col xl={3}>
                                <EnergyMetadataContainer metadata={metadata} isFetching={metadataFetching} />

                                <Brick sizeInRem={1} />

                                <MetadataContainer metadata={metadata} isFetching={metadataFetching} />

                                <Brick sizeInRem={1} />
                            </Col>

                            <Col xl={9}>
                                <div className="select-by">
                                    <div className="d-flex">
                                        <div className="mr-2 select-by-type">
                                            <Select
                                                defaultValue={selectedConsumption}
                                                options={metric}
                                                onChange={handleSelect}
                                            />
                                        </div>
                                        <Header type="page" />
                                    </div>
                                </div>

                                {chartDataFetching ? (
                                    <div className="line-chart-wrapper">
                                        <div className="line-chart-loader">
                                            <Spinner color="primary" />
                                        </div>
                                    </div>
                                ) : (
                                    <LineChart
                                        title={''}
                                        subTitle={''}
                                        tooltipUnit={metric[0]?.unit}
                                        tooltipLabel={metric[0]?.consumption}
                                        data={chartData}
                                        chartProps={chartProps}
                                    />
                                )}
                                <Brick sizeInRem={2} />

                                <Header title="Equipments" type="page" showExplore={false} showCalendar={false} />

                                <Brick sizeInRem={1} />

                                <SpacesEquipmentTable />
                            </Col>
                        </Row>
                    </div>
                )}

                {selectedTab === 1 && (
                    <ConfigurationTab
                        bldgId={bldgId}
                        spaceId={spaceId}
                        selectedFloorId={selectedFloorId}
                        spaceObj={spaceObj}
                        setSpaceObj={setSpaceObj}
                        notifyUser={notifyUser}
                        allParentSpaces={allParentSpaces}
                        errorObj={errorObj}
                    />
                )}
            </div>
        </Modal>
    );
};

export default SpaceConfiguration;
