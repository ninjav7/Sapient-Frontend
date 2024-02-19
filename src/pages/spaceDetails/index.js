import React, { useEffect, useState } from 'react';
import 'moment-timezone';
import { useHistory } from 'react-router-dom';
import { Row, Col, Spinner } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';

import Header from '../../components/Header';
import Button from '../../sharedComponents/button/Button';
import Select from '../../sharedComponents/form/select';
import LineChart from '../../sharedComponents/lineChart/LineChart';
import Typography from '../../sharedComponents/typography';
import Brick from '../../sharedComponents/brick';

import { BuildingStore } from '../../store/BuildingStore';
import { UserStore } from '../../store/UserStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { buildingData } from '../../store/globalState';

import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { dateTimeFormatForHighChart, formatXaxisForHighCharts } from '../../helpers/helpers';
import { defaultMetrics } from './constants';
import { handleDataConversion } from './helper';

import { fetchEnergyConsumptionBySpace, fetchSpaceMetadata } from './services';

import MetadataContainer from './MetadataContainer/index';
import EnergyMetadataContainer from './EnergyMetadataContainer/index';
import { ReactComponent as RightArrow } from '../../assets/icon/arrow-space-details.svg';

import '../../sharedComponents/typography/style.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import '../settings/passive-devices/styles.scss';
import './styles.scss';

// make styles according to Figma

const SpaceDetails = () => {
    const history = useHistory();
    const { spaceId, bldgId } = useParams();

    const [buildingListData] = useAtom(buildingData);

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
    const [selectedConsumption, setConsumption] = useState(metric[0]?.value);

    const fetchChartData = async () => {
        setChartDataFetching(true);
        setChartData([]);

        try {
            const query = { spaceId, bldgId, dateFrom: startDate, dateTo: endDate, timeZone };

            const resSpace = await fetchEnergyConsumptionBySpace(query);

            if (!Array.isArray(resSpace)) return;

            const spaceObj = resSpace[0];

            if (!Array.isArray(spaceObj?.total_data)) return;

            const mappedSpaceData = spaceObj.total_data.map((consumptionData) => ({
                x: new Date(consumptionData?.time_stamp).getTime(),
                y: handleDataConversion(consumptionData?.consumption, selectedConsumption),
            }));

            const spaceRecord = {
                name: spaceObj.space_name,
                data: mappedSpaceData,
            };

            setChartData([spaceRecord]);
        } catch (e) {
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

            if (res) setMetadata(res);
        } catch {
            setMetadata({});
        }

        setMetadataFetching(false);
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Building Overview',
                    path: '/spaces/space/overview',
                    active: true,
                },
            ];
            bs.items = newList;
        });

        ComponentStore.update((s) => {
            s.parent = 'spaces-building';
        });
    };

    useEffect(() => {
        if (!spaceId || !selectedConsumption || !bldgId || !startDate || !endDate) return;

        fetchChartData();
        fetchMetadata();
    }, [spaceId, startDate, endDate, selectedConsumption, bldgId]);

    useEffect(() => {
        window.scrollTo(0, 0);
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        if (startDate === null || endDate === null) return;

        let time_zone = 'US/Eastern';

        if (bldgId) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);

            if (bldgObj?.building_id) {
                if (bldgObj?.timezone) time_zone = bldgObj?.timezone;
                updateBuildingStore(
                    bldgObj?.building_id,
                    bldgObj?.building_name,
                    bldgObj?.timezone,
                    bldgObj?.plug_only
                );
            }
        }
    }, [startDate, endDate, bldgId]);

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

    const selectedMetricsTab = () => setSelectedTab(0);
    const selectedConfiguresTab = () => setSelectedTab(1);
    const dynamicActiveClassTab = (selectedIdTab) => (selectedTab === selectedIdTab ? 'active-tab-style' : '');
    const handleSelect = (e) => setConsumption(e.value);
    const spaceName = metadata?.space_name && metadata.space_name;

    return (
        <div>
            <div>
                <Row>
                    <Col lg={12}>
                        <div className="passive-header-wrapper d-flex justify-content-between upper-content-container">
                            <div className="d-flex flex-column justify-content-between">
                                <div className="space-tree-info">
                                    <Typography.Subheader size={Typography.Sizes.sm}>Spaces</Typography.Subheader>
                                    <RightArrow className="ml-2 mr-2 w-16 h-16" />
                                    <Typography.Subheader size={Typography.Sizes.sm}>{spaceName}</Typography.Subheader>
                                </div>
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
                                <div>
                                    <Button
                                        label="Close"
                                        size={Button.Sizes.md}
                                        type={Button.Type.secondaryGrey}
                                        onClick={() => history.push(`/spaces/building/overview/${bldgId}`)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

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
                                    <div className="mr-2 mw-100">
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
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default SpaceDetails;
