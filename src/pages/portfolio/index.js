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
import TotalEnergyConsumption from '../../sharedComponents/totalEnergyConsumption';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import './style.scss';
import { apiRequestBody } from '../../helpers/helpers';
import { updateBuildingStore } from '../../components/SecondaryTopNavBar/utils';
import { BuildingStore } from '../../store/BuildingStore';

const PortfolioOverview = () => {
    const [userPermission] = useAtom(userPermissionData);
    const [buildingsEnergyConsume, setBuildingsEnergyConsume] = useState([]);
    const [energyConsumption, setenergyConsumption] = useState([]);
    const [isEnergyConsumptionChartLoading, setIsEnergyConsumptionChartLoading] = useState(false);
    const [markers, setMarkers] = useState([]);

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const [startEndDayCount, setStartEndDayCount] = useState(0);

    const [energyConsumptionChart, setEnergyConsumptionChart] = useState([]);
    const [isConsumpHistoryLoading, setIsConsumpHistoryLoading] = useState(false);

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

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }

        const portfolioOverallData = async () => {
            setIsKPIsLoading(true);
            let payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchPortfolioOverall(payload)
                .then((res) => {
                    setOveralldata(res.data);
                    setIsKPIsLoading(false);
                })
                .catch((error) => {
                    setIsKPIsLoading(false);
                });
        };

        const portfolioEndUsesData = async () => {
            setIsEnergyConsumptionChartLoading(true);
            let payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchPortfolioEndUse(payload)
                .then((res) => {
                    let response = res?.data;
                    response.sort((a, b) => b.energy_consumption.now - a.energy_consumption.now);
                    response.forEach((record) => {
                        record.energy_consumption.now = Math.round(record.energy_consumption.now);
                        record.energy_consumption.old = Math.round(record.energy_consumption.old);
                        record.after_hours_energy_consumption.now = Math.round(
                            record.after_hours_energy_consumption.now
                        );
                        record.after_hours_energy_consumption.old = Math.round(
                            record.after_hours_energy_consumption.old
                        );
                    });
                    setenergyConsumption(response);
                    setIsEnergyConsumptionChartLoading(false);
                })
                .catch((error) => {
                    setIsEnergyConsumptionChartLoading(false);
                });
        };

        const energyConsumptionData = async () => {
            let payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchPortfolioEnergyConsumption(payload)
                .then((res) => {
                    let newArray = [
                        {
                            name: 'Energy Value(kWh)',
                            data: [],
                        },
                    ];
                    res.data.forEach((record) => {
                        newArray[0].data.push({
                            x: record.x,
                            y: Math.round(record.y / 1000),
                        });
                    });
                    setEnergyConsumptionChart(newArray);
                    setIsConsumpHistoryLoading(false);
                })
                .catch((error) => {
                    setIsConsumpHistoryLoading(false);
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

        portfolioBuilidingsData();
        portfolioOverallData();
        portfolioEndUsesData();
        energyConsumptionData();
    }, [startDate, endDate]);

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

        const updateBuildingStore = () => {
            BuildingStore.update((s) => {
                s.BldgId = 'portfolio';
                s.BldgName = 'Portfolio';
                s.BldgTimeZone = '';
            });
        };

        updateBreadcrumbStore();
        updateBuildingStore();
    }, []);

    useEffect(() => {
        const start = moment(startDate);
        const end = moment(endDate);
        const days = end.diff(start, 'days');
        setStartEndDayCount(days + 1);
    });

    return (
        <>
            <Header title="Portfolio Overview" type="page" />
            {userPermission?.user_role === 'admin' ||
            userPermission?.permissions?.permissions?.energy_portfolio_permission?.view ? (
                <>
                    <Row className="mt-4 mb-2">
                        <div>
                            <PortfolioKPIs
                                daysCount={daysCount}
                                totalBuilding={buildingsEnergyConsume.length}
                                overalldata={overalldata}
                                isKPIsLoading={isKPIsLoading}
                            />
                        </div>
                    </Row>

                    <Row className="mt-3 container-gap">
                        <Col lg={6}>
                            <EnergyConsumptionByEndUse
                                title="Energy Consumption by End Use"
                                subtitle="Totals in kWh"
                                energyConsumption={energyConsumption}
                                isEnergyConsumptionChartLoading={isEnergyConsumptionChartLoading}
                                pageType="portfolio"
                                className="h-100"
                            />
                        </Col>
                        <Col lg={6}>
                            <TotalEnergyConsumption
                                title="Total Energy Consumption"
                                subtitle="Hourly Energy Consumption (kWh)"
                                series={energyConsumptionChart}
                                isConsumpHistoryLoading={isConsumpHistoryLoading}
                                startEndDayCount={startEndDayCount}
                                timeZone={timeZone}
                                pageType="portfolio"
                            />
                        </Col>
                    </Row>
                </>
            ) : (
                <p>You don't have the permission to view this page</p>
            )}
        </>
    );
};

export default PortfolioOverview;
