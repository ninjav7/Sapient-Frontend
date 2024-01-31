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
import { fetchEnergyConsumptionBySpaceDataHelper } from '../../components/energyConsumptionBySpace/helpers';
import SpacesListTable from './SpacesListTable';

const Spaces = () => {
    const { bldgId } = useParams();
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

    // const fetchEnergyConsumptionBySpaceData = async (tzInfo) => {
    //     setChartLoading(true);

    //     const query = { bldgId, dateFrom: startDate, dateTo: endDate, tzInfo };

    //     try {
    //         const data = await fetchEnergyConsumptionBySpaceDataHelper({ query });

    //         if (data?.newSpacesColumnCategories?.length > 0) setSpacesColumnCategories(data.newSpacesColumnCategories);
    //         if (data?.newSpacesData?.length > 0) setSpacesData(data.newSpacesData);
    //         if (data?.newSpacesColumnChartData?.length > 0) setSpacesColumnChartData(data.newSpacesColumnChartData);
    //         if (data?.newSpacesDataCategories?.length > 0) setSpacesDataCategories(data.newSpacesDataCategories);
    //     } catch {
    //         setSpacesColumnCategories([]);
    //         setSpacesData([]);
    //         setSpacesColumnChartData([]);
    //         setSpacesDataCategories([]);
    //     }

    //     setChartLoading(false);
    // };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Spaces',
                    path: '/energy/spaces',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'buildings';
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        updateBreadcrumbStore();
    }, []);

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

        // fetchEnergyConsumptionBySpaceData(time_zone);
    }, [startDate, endDate, bldgId]);

    return (
        <>
            <Header title="Spaces" type="page" showExplore={true} />
            <Brick sizeInRem={1.5} />

            {/* <EnergyConsumptionBySpaceChart
                propTitle="Energy Consumption (kWh)"
                propSubTitle="Top Energy Consumers"
                spacesData={spacesData}
                stackedColumnChartData={spacesColumnChartData}
                stackedColumnChartCategories={spacesColumnCategories}
                spaceCategories={spacesDataCategories}
                xAxisObj={xAxisObj}
                timeZone={timeZone}
                dateFormat={dateFormat}
                daysCount={daysCount}
                isChartLoading={chartLoading}
            />

            <Brick sizeInRem={1.5} /> */}

            <SpacesListTable colorfulSpaces={spacesData} />
        </>
    );
};

export default Spaces;
