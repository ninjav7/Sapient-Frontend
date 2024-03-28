import React, { useEffect, useState } from 'react';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { UserStore } from '../../store/UserStore';
import { useParams } from 'react-router-dom';
import { fetchKPISpaceV2 } from './services';
import { UNITS } from '../../constants/units';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import { percentageHandler } from '../../utils/helper';
import { Col } from 'reactstrap';
import DonutChartWidget, { DONUT_CHART_TYPES } from '../../sharedComponents/donutChartWidget';
import useColors from '../../sharedComponents/hooks/useColors';
import { handleAPIRequestParams } from '../../helpers/helpers';

const PieChartsSection = () => {
    const { bldgId } = useParams();

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const startTime = DateRangeStore.useState((s) => s.startTime);
    const endTime = DateRangeStore.useState((s) => s.endTime);

    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const userPrefUnits = UserStore.useState((s) => s.unit);

    const [KPIEnergyData, setKPIEnergyData] = useState([]);
    const [KPIEnergyDataTotal, setKPIEnergyDataTotal] = useState(0);
    const [KPIEnergyFetching, setKPIEnergyFetching] = useState(true);
    const [KPISquareData, setKPISquareData] = useState([]);
    const [KPISquareTotal, setKPISquareTotal] = useState(0);
    const [KPISquareFetching, setKPISquareFetching] = useState(true);
    const [KPICountData, setKPICountData] = useState([]);
    const [KPICountTotal, setKPICountTotal] = useState(0);
    const [KPICountFetching, setKPICountFetching] = useState(true);

    const { getColor } = useColors();

    const fetchKPICount = async (tzInfo) => {
        setKPICountFetching(true);

        const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);

        const query = {
            bldgId,
            dateFrom: encodeURIComponent(dateFrom),
            dateTo: encodeURIComponent(dateTo),
            tzInfo,
            orderedBy: 'space_count',
        };

        try {
            const response = await fetchKPISpaceV2(query);

            if (response.success) {
                const data = response.data.space_type_usage;

                let KPICountTotal = 0;
                const KPICountData = [];

                data.forEach((record) => {
                    const { name, space_count, id } = record || {};

                    const label = name;
                    KPICountTotal += space_count;

                    const color = getColor(id);

                    KPICountData.push({
                        color,
                        label,
                        value: space_count,
                    });
                });

                setKPICountData(KPICountData);
                setKPICountTotal(KPICountTotal);
            }
        } catch {
            setKPICountData([]);
            setKPICountTotal(0);
        }

        setKPICountFetching(false);
    };

    const fetchKPISquare = async (tzInfo) => {
        setKPISquareFetching(true);

        const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);

        const query = {
            bldgId,
            dateFrom: encodeURIComponent(dateFrom),
            dateTo: encodeURIComponent(dateTo),
            tzInfo,
            orderedBy: 'total_square_footage',
        };

        try {
            const response = await fetchKPISpaceV2(query);

            if (response.success) {
                const data = response.data.space_type_usage;

                let KPISquareTotal = 0;
                const KPISquareData = [];

                data.forEach((record) => {
                    const { name, total_square_footage, id } = record || {};

                    const square = total_square_footage ?? 0;

                    const label = name;
                    KPISquareTotal += square;

                    const color = getColor(id);

                    KPISquareData.push({
                        unit: userPrefUnits === 'si' ? UNITS.SQ_M : UNITS.SQ_FT,
                        color,
                        label,
                        value: square,
                    });
                });

                setKPISquareData(KPISquareData);
                setKPISquareTotal(KPISquareTotal);
            }
        } catch {
            setKPISquareData([]);
            setKPISquareTotal(0);
        }

        setKPISquareFetching(false);
    };

    const fetchKPIEnergy = async (tzInfo) => {
        setKPIEnergyFetching(true);

        const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);

        const query = {
            bldgId,
            dateFrom: encodeURIComponent(dateFrom),
            dateTo: encodeURIComponent(dateTo),
            tzInfo,
            orderedBy: 'consumption',
        };

        try {
            const response = await fetchKPISpaceV2(query);

            if (response.success) {
                const data = response.data.space_type_usage;

                let KPIEnergyTotal = 0;
                const KPIEnergyData = [];

                data.forEach((record) => {
                    const { name, on_hours_usage, id } = record || {};

                    const valueEnergyNew = Math.round((on_hours_usage?.new ?? 0) / 1000);
                    const valueEnergyOld = Math.round((on_hours_usage?.old ?? 0) / 1000);

                    const label = name;
                    KPIEnergyTotal += valueEnergyNew;

                    const trendType =
                        valueEnergyNew <= valueEnergyOld
                            ? TRENDS_BADGE_TYPES.DOWNWARD_TREND
                            : TRENDS_BADGE_TYPES.UPWARD_TREND;

                    const trendValue = percentageHandler(valueEnergyNew, valueEnergyOld);

                    const color = getColor(id);

                    KPIEnergyData.push({ unit: UNITS.KWH, color, label, value: valueEnergyNew, trendValue, trendType });
                });

                setKPIEnergyData(KPIEnergyData);
                setKPIEnergyDataTotal(KPIEnergyTotal);
            }
        } catch (e) {
            setKPIEnergyData([]);
            setKPIEnergyDataTotal(0);
        }

        setKPIEnergyFetching(false);
    };

    useEffect(() => {
        if (!startDate || !endDate) return;

        fetchKPIEnergy(timeZone);
        fetchKPISquare(timeZone);
        fetchKPICount(timeZone);
    }, [startDate, endDate, startTime, endTime, bldgId, userPrefUnits]);

    return (
        <div style={{ display: 'flex', margin: '0 -12px' }}>
            <Col lg={4}>
                <DonutChartWidget
                    id="consumptionCountBySpaceTypeDonut"
                    title="Space Count"
                    subtitle="By Space Type"
                    items={KPICountData}
                    type={DONUT_CHART_TYPES.VERTICAL}
                    onMoreDetail={null}
                    computedTotal={KPICountTotal}
                    isChartLoading={KPICountFetching}
                    isShowTrend={false}
                    donutLabelsClass="fixed-labels-list"
                />
            </Col>
            <Col lg={4}>
                <DonutChartWidget
                    id="consumptionSquareBySpaceTypeDonut"
                    title={`${userPrefUnits === 'si' ? 'Square Meters' : 'Square Footage'}`}
                    subtitle="By Space Type"
                    items={KPISquareData}
                    type={DONUT_CHART_TYPES.VERTICAL}
                    onMoreDetail={null}
                    computedTotal={KPISquareTotal}
                    isChartLoading={KPISquareFetching}
                    isShowTrend={false}
                    donutLabelsClass="fixed-labels-list"
                />
            </Col>
            <Col lg={4}>
                <DonutChartWidget
                    id="consumptionEnergyBySpaceTypeDonut"
                    title="Energy Consumption"
                    subtitle="By Space Type"
                    items={KPIEnergyData}
                    type={DONUT_CHART_TYPES.VERTICAL}
                    onMoreDetail={null}
                    computedTotal={KPIEnergyDataTotal}
                    isChartLoading={KPIEnergyFetching}
                    isShowTrend={false}
                    donutLabelsClass="fixed-labels-list"
                />
            </Col>
        </div>
    );
};

export default PieChartsSection;
