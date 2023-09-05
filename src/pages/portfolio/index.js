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
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import { apiRequestBody } from '../../helpers/helpers';
import Brick from '../../sharedComponents/brick';
import ColumnChart from '../../sharedComponents/columnChart/ColumnChart';
import colors from '../../assets/scss/_colors.scss';
import { UNITS } from '../../constants/units';
import { xaxisLabelsCount, xaxisLabelsFormat } from '../../sharedComponents/helpers/highChartsXaxisFormatter';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { UserStore } from '../../store/UserStore';
import './style.scss';

const PortfolioOverview = () => {
    const [userPermission] = useAtom(userPermissionData);
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

    const [overalldata, setOveralldata] = useState({
        total_building: 0,
        total_consumption: {
            now: 0,
            old: 0,
        },
        average_energy_density: {
            now: 0,
            old: 0,
        },
        yearly_electric_eui: {
            now: 0,
            old: 0,
        },
    });

    const [isKPIsLoading, setIsKPIsLoading] = useState(false);
    const [dateFormat, setDateFormat] = useState('MM/DD HH:00');
    const [energyConsumptionsCategories, setEnergyConsumptionsCategories] = useState([]);
    const [energyConsumptionsData, setEnergyConsumptionsData] = useState([]);
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
            setIsKPIsLoading(true);
            let payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchPortfolioOverall(payload)
                .then((res) => {
                    if (res?.data) setOveralldata(res?.data);
                    setIsKPIsLoading(false);
                })
                .catch((error) => {
                    setIsKPIsLoading(false);
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
                    setIsEnergyConsumptionChartLoading(false);
                })
                .catch((error) => {
                    setIsEnergyConsumptionChartLoading(false);
                });
        };

        const energyConsumptionData = async () => {
            const payload = apiRequestBody(startDate, endDate, timeZone);
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
                .catch((error) => {});
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

        portfolioBuilidingsData();
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
    }, []);

    return (
        <>
            <Header title="Portfolio Overview" type="page" />

            <Brick sizeInRem={1.5} />

            {userPermission?.user_role === 'admin' ||
            userPermission?.permissions?.permissions?.energy_portfolio_permission?.view ? (
                <>
                    <Row>
                        <div>
                            <PortfolioKPIs
                                daysCount={daysCount}
                                totalBuilding={buildingsEnergyConsume.length}
                                overalldata={overalldata}
                                userPrefUnits={userPrefUnits}
                            />
                        </div>
                    </Row>

                    <Brick sizeInRem={1.5} />

                    <Row className="container-gap">
                        <Col xl={6}>
                            <EnergyConsumptionByEndUse
                                title="Energy Consumption by End Use"
                                subtitle="Totals in kWh"
                                energyConsumption={energyConsumption}
                                isEnergyConsumptionChartLoading={isEnergyConsumptionChartLoading}
                                pageType="portfolio"
                                className="h-100"
                            />
                        </Col>
                        <Col xl={6}>
                            <ColumnChart
                                title="Total Energy Consumption"
                                subTitle="Hourly Energy Consumption (kWh)"
                                colors={[colors.datavizMain2, colors.datavizMain1]}
                                categories={energyConsumptionsCategories}
                                tooltipUnit={UNITS.KWH}
                                series={energyConsumptionsData}
                                isLegendsEnabled={false}
                                timeZone={timeZone}
                                xAxisCallBackValue={formatXaxis}
                                restChartProps={xAxisObj}
                                tooltipCallBackValue={toolTipFormatter}
                            />
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
