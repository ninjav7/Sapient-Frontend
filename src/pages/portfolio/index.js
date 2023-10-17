import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import Header from '../../components/Header';
import moment from 'moment';
import {
    fetchPortfolioBuilidings,
    fetchPortfolioOverall,
    fetchPortfolioEndUse,
    fetchPortfolioEnergyConsumption,
} from '../portfolio/services';
import { timeZone } from '../../utils/helper';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import 'react-loading-skeleton/dist/skeleton.css';
import PortfolioKPIs from './PortfolioKPIs';
import EnergyConsumptionByEndUse from '../../sharedComponents/energyConsumptionByEndUse';
import Typography from '../../sharedComponents/typography';
import CompareBuildings from '../compareBuildings';
import { useAtom } from 'jotai';
import { buildingData, userPermissionData } from '../../store/globalState';
import { apiRequestBody } from '../../helpers/helpers';
import Brick from '../../sharedComponents/brick';
import ColumnChart from '../../sharedComponents/columnChart/ColumnChart';
import { UNITS } from '../../constants/units';
import { validateIntervals } from '../../sharedComponents/helpers/helper';
import { xaxisLabelsCount, xaxisLabelsFormat } from '../../sharedComponents/helpers/highChartsXaxisFormatter';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { UserStore } from '../../store/UserStore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import colors from '../../assets/scss/_colors.scss';
import colorPalette from '../../assets/scss/_colors.scss';
import './style.scss';

const PortfolioOverview = () => {
    const [userPermission] = useAtom(userPermissionData);
    const [buildingListData] = useAtom(buildingData);

    const [buildingsEnergyConsume, setBuildingsEnergyConsume] = useState([]);
    const [energyConsumption, setenergyConsumption] = useState([]);
    const [isEnergyConsumptionChartLoading, setIsEnergyConsumptionChartLoading] = useState(false);
    const [markers, setMarkers] = useState([]);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefUnits = UserStore.useState((s) => s.unit);
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [isFetchingKPIsData, setFetchingKPIsData] = useState(false);
    const [overallData, setOverallData] = useState({
        total: {
            now: 0,
            old: 0,
            change: 0,
        },
        average: {
            now: 0,
            old: 0,
            change: 0,
        },
    });

    const [dateFormat, setDateFormat] = useState('MM/DD HH:00');
    const [energyConsumptionsCategories, setEnergyConsumptionsCategories] = useState([]);
    const [energyConsumptionsData, setEnergyConsumptionsData] = useState([]);
    const [isEnergyChartLoading, setEnergyChartLoading] = useState(false);
    const [xAxisObj, setXAxisObj] = useState({
        xAxis: {
            tickPositioner: function () {
                var positions = [],
                    tick = Math.floor(this.dataMin),
                    increment = Math.ceil((this.dataMax - this.dataMin) / 4);
                if (this.dataMax !== null && this.dataMin !== null) {
                    for (tick; tick - increment <= this.dataMax; tick += increment) {
                        positions.push(tick);
                    }
                }
                return positions;
            },
        },
    });

    const consumptionType = validateIntervals(daysCount);

    const formatXaxis = ({ value }) => {
        return moment.utc(value).format(`${dateFormat}`);
    };

    const toolTipFormatter = ({ value }) => {
        const time_format = userPrefTimeFormat === `24h` ? `HH:mm` : `hh:mm A`;
        const date_format = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM 'YY` : `MMM D 'YY`;

        return daysCount >= 182
            ? moment.utc(value).format(`MMM 'YY`)
            : moment.utc(value).format(`${date_format} @ ${time_format}`);
    };

    useEffect(() => {
        const getXaxisForDaysSelected = (days_count) => {
            const xaxisObj = xaxisLabelsCount(days_count);
            if (xaxisObj) xaxisObj.legend = { enabled: false };
            setXAxisObj(xaxisObj);
        };

        const getFormattedChartDates = (days_count, timeFormat, dateFormat) => {
            const date_format = xaxisLabelsFormat(days_count, timeFormat, dateFormat);
            setDateFormat(date_format);
        };

        getXaxisForDaysSelected(daysCount);
        getFormattedChartDates(daysCount, userPrefTimeFormat, userPrefDateFormat);
    }, [daysCount, userPrefTimeFormat, userPrefDateFormat]);

    useEffect(() => {
        if (startDate === null || endDate === null) return;

        const portfolioOverallData = async () => {
            setFetchingKPIsData(true);
            const payload = {
                date_from: encodeURIComponent(startDate),
                date_to: encodeURIComponent(endDate),
                tz_info: encodeURIComponent(timeZone),
                metric: 'energy',
            };

            await fetchPortfolioOverall(payload)
                .then((res) => {
                    const response = res?.data;
                    if (response?.success && response?.data) {
                        setOverallData(response?.data);
                    }
                })
                .finally(() => {
                    setFetchingKPIsData(false);
                });
        };

        const portfolioEndUsesData = async () => {
            setIsEnergyConsumptionChartLoading(true);
            const params = `?off_hours=false`;
            const payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchPortfolioEndUse(params, payload)
                .then((res) => {
                    const response = res?.data?.data;
                    response.sort((a, b) => b?.energy_consumption?.now - a?.energy_consumption?.now);
                    response.forEach((record) => {
                        record.energy_consumption.now = Math.round(record.energy_consumption.now);
                        record.energy_consumption.old = Math.round(record.energy_consumption.old);
                    });
                    setenergyConsumption(response);
                })
                .finally(() => {
                    setIsEnergyConsumptionChartLoading(false);
                });
        };

        const energyConsumptionData = async () => {
            const payload = apiRequestBody(startDate, endDate, timeZone);
            setEnergyChartLoading(true);

            await fetchPortfolioEnergyConsumption(payload)
                .then((res) => {
                    const response = res?.data;
                    let energyCategories = [];
                    let energyData = [
                        {
                            name: 'Energy',
                            data: [],
                        },
                    ];
                    response.forEach((record) => {
                        energyCategories.push(record?.x);
                        energyData[0].data.push(parseFloat((record?.y / 1000).toFixed(2)));
                    });
                    setEnergyConsumptionsCategories(energyCategories);
                    setEnergyConsumptionsData(energyData);
                })
                .finally(() => {
                    setEnergyChartLoading(false);
                });
        };

        const portfolioBuilidingsData = async () => {
            let payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchPortfolioBuilidings(payload)
                .then((res) => {
                    let data = res.data;
                    setBuildingsEnergyConsume(data);
                    let markerArray = [];
                    data.map((record) => {
                        let markerObj = {
                            markerOffset: 25,
                            name: record.buildingName,
                            coordinates: [parseInt(record.lat), parseInt(record.long)],
                        };
                        markerArray.push(markerObj);
                    });
                    const markerArr = [
                        { markerOffset: 25, name: 'NYPL', coordinates: [-74.006, 40.7128] },
                        { markerOffset: 25, name: 'Justin', coordinates: [90.56, 76.76] },
                    ];
                    setMarkers(markerArr);
                })
                .catch((error) => {});
        };

        // portfolioBuilidingsData(); // Planned to enable when maps integrated in Portfolio Page
        portfolioOverallData();
        portfolioEndUsesData();
        energyConsumptionData();
    }, [startDate, endDate, userPrefUnits]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Portfolio Overview',
                        path: '/energy/portfolio/overview',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'portfolio';
            });
        };

        const updateBuildingData = () => {
            updateBuildingStore('portfolio', 'Portfolio', '');
        };

        updateBreadcrumbStore();
        updateBuildingData();
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Header title="Portfolio Overview" type="page" />

            <Brick sizeInRem={1.5} />

            {userPermission?.user_role === 'admin' ||
            userPermission?.permissions?.permissions?.energy_portfolio_permission?.view ? (
                <>
                    <Row>
                        {isFetchingKPIsData ? (
                            <Skeleton
                                baseColor={colorPalette.primaryGray150}
                                highlightColor={colorPalette.baseBackground}
                                count={1}
                                height={70}
                                width={500}
                                borderRadius={10}
                                className="ml-2"
                            />
                        ) : (
                            <PortfolioKPIs
                                totalBuilding={buildingListData.length !== 0 ? buildingListData.length : 0}
                                overallData={overallData}
                                daysCount={daysCount}
                                userPrefUnits={userPrefUnits}
                            />
                        )}
                    </Row>

                    <Brick sizeInRem={1.5} />

                    <Row>
                        <Col xl={6}>
                            <EnergyConsumptionByEndUse
                                title="Energy Consumption by End Use"
                                subtitle="Totals in kWh"
                                energyConsumption={energyConsumption}
                                isChartLoading={isEnergyConsumptionChartLoading}
                                pageType="portfolio"
                                className="h-100"
                            />
                        </Col>
                        <Col xl={6}>
                            <ColumnChart
                                title="Total Energy Consumption"
                                subTitle={`${consumptionType} Energy Consumption (kWh)`}
                                colors={[colors.datavizMain2, colors.datavizMain1]}
                                categories={energyConsumptionsCategories}
                                tooltipUnit={UNITS.KWH}
                                series={energyConsumptionsData}
                                isLegendsEnabled={false}
                                timeZone={timeZone}
                                xAxisCallBackValue={formatXaxis}
                                restChartProps={xAxisObj}
                                tooltipCallBackValue={toolTipFormatter}
                                isChartLoading={isEnergyChartLoading}
                            />
                        </Col>
                    </Row>

                    <Brick sizeInRem={2} />

                    <Row>
                        <Col xl={12}>
                            <Typography.Header
                                size={Typography.Sizes.lg}
                                className="font-weight-bold">{`Compare Buildings`}</Typography.Header>

                            <Brick sizeInRem={1.5} />
                            <CompareBuildings />
                        </Col>
                    </Row>
                </>
            ) : (
                <div>You don't have the permission to view this page</div>
            )}
        </>
    );
};

export default PortfolioOverview;
