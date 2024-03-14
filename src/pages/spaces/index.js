import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Brick from '../../sharedComponents/brick';
import { useAtom } from 'jotai';
import { useParams } from 'react-router-dom';
import { BuildingStore } from '../../store/BuildingStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { UserStore } from '../../store/UserStore';
import { buildingData } from '../../store/globalState';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import EnergyConsumptionBySpaceChart from '../../components/energyConsumptionBySpace';
import { xaxisLabelsCount, xaxisLabelsFormat } from '../../sharedComponents/helpers/highChartsXaxisFormatter';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { fetchTopEnergyConsumptionBySpaceDataHelper } from '../../components/energyConsumptionBySpace/helpers';
import SpacesListTable from './SpacesListTable';
import { useHistory } from 'react-router-dom';
import { Col } from 'reactstrap';

const Spaces = () => {
    const { bldgId } = useParams();
    const history = useHistory();

    const [buildingListData] = useAtom(buildingData);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);

    const [chartLoading, setChartLoading] = useState(false);
    const [spacesData, setSpacesData] = useState([]);
    const [spacesDataCategories, setSpacesDataCategories] = useState([]);
    const [spacesColumnCategories, setSpacesColumnCategories] = useState([]);
    const [spacesColumnChartData, setSpacesColumnChartData] = useState([]);
    const [yearlyChartLoading, setYearlyChartLoading] = useState(false);
    const [yearlySpacesData, setYearlySpacesData] = useState([]);
    const [yearlySpacesDataCategories, setYearlySpacesDataCategories] = useState([]);
    const [yearlySpacesColumnCategories, setYearlySpacesColumnCategories] = useState([]);
    const [yearlySpacesColumnChartData, setYearlySpacesColumnChartData] = useState([]);

    const [dateFormat, setDateFormat] = useState('MM/DD HH:00');

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

    const fetchEnergyConsumptionBySpaceData = async (tzInfo) => {
        setChartLoading(true);

        const query = { bldgId, dateFrom: startDate, dateTo: endDate, tzInfo, yearly: false };

        try {
            const data = await fetchTopEnergyConsumptionBySpaceDataHelper({ query });

            if (data?.newSpacesColumnCategories?.length > 0) setSpacesColumnCategories(data.newSpacesColumnCategories);
            if (data?.newSpacesData?.length > 0) setSpacesData(data.newSpacesData);
            if (data?.newSpacesColumnChartData?.length > 0) setSpacesColumnChartData(data.newSpacesColumnChartData);
            if (data?.newSpacesDataCategories?.length > 0) setSpacesDataCategories(data.newSpacesDataCategories);
        } catch {
            setSpacesColumnCategories([]);
            setSpacesData([]);
            setSpacesColumnChartData([]);
            setSpacesDataCategories([]);
        }

        setChartLoading(false);
    };

    const fetchEnergyConsumptionBySpaceDataYearly = async (tzInfo) => {
        setYearlyChartLoading(true);

        const query = { bldgId, dateFrom: startDate, dateTo: endDate, tzInfo, yearly: true };

        try {
            const data = await fetchTopEnergyConsumptionBySpaceDataHelper({ query });

            if (data?.newSpacesColumnCategories?.length > 0)
                setYearlySpacesColumnCategories(data.newSpacesColumnCategories);
            if (data?.newSpacesData?.length > 0) setYearlySpacesData(data.newSpacesData);
            if (data?.newSpacesColumnChartData?.length > 0)
                setYearlySpacesColumnChartData(data.newSpacesColumnChartData);
            if (data?.newSpacesDataCategories?.length > 0) setYearlySpacesDataCategories(data.newSpacesDataCategories);
        } catch {
            setYearlySpacesColumnCategories([]);
            setYearlySpacesData([]);
            setYearlySpacesColumnChartData([]);
            setYearlySpacesDataCategories([]);
        }

        setYearlyChartLoading(false);
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Building Overview',
                    path: '/spaces/building/overview',
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
        window.scrollTo(0, 0);
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        if (!startDate || !endDate || !bldgId) return;

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
        } else {
            const bldgObj = buildingListData[0];

            if (bldgObj?.building_id) {
                if (bldgObj?.timezone) time_zone = bldgObj?.timezone;
                updateBuildingStore(
                    bldgObj?.building_id,
                    bldgObj?.building_name,
                    bldgObj?.timezone,
                    bldgObj?.plug_only
                );

                history.push(`/spaces/building/overview/${bldgObj?.building_id}`);
            }
        }

        fetchEnergyConsumptionBySpaceDataYearly(time_zone);
        fetchEnergyConsumptionBySpaceData(time_zone);
    }, [startDate, endDate, bldgId]);

    return bldgId ? (
        <Col lg={12}>
            <Header title="Building Overview" type="page" showExplore={true} />

            <Brick sizeInRem={2} />

            <div className="row">
                <EnergyConsumptionBySpaceChart
                    propTitle="Top 15 Energy Consuming Spaces (kWh)"
                    propSubTitle="Over past 12 months"
                    spacesData={yearlySpacesData}
                    stackedColumnChartData={yearlySpacesColumnChartData}
                    stackedColumnChartCategories={yearlySpacesColumnCategories}
                    spaceCategories={yearlySpacesDataCategories}
                    xAxisObj={xAxisObj}
                    timeZone={timeZone}
                    dateFormat={dateFormat}
                    daysCount={daysCount}
                    isChartLoading={yearlyChartLoading}
                    half={true}
                />

                <EnergyConsumptionBySpaceChart
                    propTitle="Energy Consumption by Space (kWh)"
                    propSubTitle="Top 15 Energy Consumers"
                    spacesData={spacesData}
                    stackedColumnChartData={spacesColumnChartData}
                    stackedColumnChartCategories={spacesColumnCategories}
                    spaceCategories={spacesDataCategories}
                    xAxisObj={xAxisObj}
                    timeZone={timeZone}
                    dateFormat={dateFormat}
                    daysCount={daysCount}
                    isChartLoading={chartLoading}
                    half={true}
                />
            </div>

            <Brick sizeInRem={4} />

            <SpacesListTable />
        </Col>
    ) : (
        <></>
    );
};

export default Spaces;
