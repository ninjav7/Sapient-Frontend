import React, { useRef } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { UNITS } from '../../constants/units';
import { UserStore } from '../../store/UserStore';
import Skeleton from 'react-loading-skeleton';
import StackedColumnChart from '../../sharedComponents/stackedColumnChart/StackedColumnChart';
import colorPalette from '../../assets/scss/_colors.scss';
import './styles.scss';
import Typography from '../../sharedComponents/typography';
import { DOWNLOAD_TYPES } from '../../sharedComponents/constants';
import DropDownIcon from '../../sharedComponents/dropDowns/dropDownButton/DropDownIcon';
import { ReactComponent as BurgerIcon } from '../../assets/icon/burger.svg';

const EnergyConsumptionBySpaceCategories = ({ spacesData }) => {
    return (
        <div className="w-100 d-flex justify-content-start spacedata-type flex-wrap">
            {spacesData?.map((record) => (
                <div className="spacedata-type-body d-flex align-items-center pl-2 pr-2">
                    <p className="dot m-0" style={{ backgroundColor: record?.color }}></p>
                    <h5 className="spacedata-type-title mt-0 mb-0 ml-2">{record?.name}</h5>
                </div>
            ))}
        </div>
    );
};

const EnergyConsumptionBySpaceChart = (props) => {
    const {
        propTitle,
        propSubTitle,
        spacesData,
        stackedColumnChartData,
        stackedColumnChartCategories,
        spaceCategories,
        xAxisObj,
        timeZone,
        dateFormat,
        daysCount,
        isChartLoading = false,
        plotBands: plotBandsProp,
        upperLegendsProps = {},
        onMoreDetail,
    } = props;

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const chartComponentRef = useRef(null);

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

    const handleDropDownOptionClicked = (name) => {
        switch (name) {
            case DOWNLOAD_TYPES.downloadSVG:
                chartComponentRef.current.chart.exportChart({ type: 'image/svg+xml' });
                break;
            case DOWNLOAD_TYPES.downloadPNG:
                chartComponentRef.current.chart.exportChart({ type: 'image/png' });
                break;
            case DOWNLOAD_TYPES.downloadCSV:
                chartComponentRef.current.chart.downloadCSV();
                break;
            default:
                break;
        }
    };

    return (
        <div className="spacedata-type-widget-wrapper">
            <div className="pr-3 pt-3 pl-3">
                <div className="d-flex justify-content-between mb-4">
                    <div>
                        <Typography.Subheader size={Typography.Sizes.md}>{propTitle}</Typography.Subheader>
                        <Typography.Body size={Typography.Sizes.xs}>{propSubTitle}</Typography.Body>
                    </div>
                    <DropDownIcon
                        classNameButton="stacked-column-chart-download-button"
                        options={[
                            {
                                name: DOWNLOAD_TYPES.downloadSVG,
                                label: 'Download SVG',
                            },
                            {
                                name: DOWNLOAD_TYPES.downloadPNG,
                                label: 'Download PNG',
                            },
                            {
                                name: DOWNLOAD_TYPES.downloadCSV,
                                label: 'Download CSV',
                            },
                        ]}
                        label={''}
                        triggerButtonIcon={<BurgerIcon />}
                        handleClick={handleDropDownOptionClicked}
                    />
                </div>
                {isChartLoading ? (
                    <Skeleton
                        baseColor={colorPalette.primaryGray150}
                        highlightColor={colorPalette.baseBackground}
                        count={1}
                        height={50}
                        width="100%"
                        borderRadius={10}
                        className="ml-2"
                    />
                ) : (
                    <EnergyConsumptionBySpaceCategories spacesData={spacesData} />
                )}
            </div>

            <div>
                <StackedColumnChart
                    style={{ width: 'auto', border: '0rem' }}
                    colors={spaceCategories}
                    categories={stackedColumnChartCategories}
                    tooltipUnit={UNITS.KWH}
                    series={stackedColumnChartData}
                    isLegendsEnabled={false}
                    timeZone={timeZone}
                    xAxisCallBackValue={formatXaxis}
                    restChartProps={xAxisObj}
                    tooltipCallBackValue={toolTipFormatter}
                    plotBandsProp={plotBandsProp}
                    upperLegendsProps={upperLegendsProps}
                    onMoreDetail={onMoreDetail}
                    isChartLoading={isChartLoading}
                    parentChartComponentRef={chartComponentRef}
                    showExport={false}
                    borderRadius={2}
                    ownTooltip={true}
                    {...props}
                />
            </div>
        </div>
    );
};

EnergyConsumptionBySpaceChart.propTypes = {
    spacesData: PropTypes.array.isRequired,
    stackedColumnChartData: PropTypes.array.isRequired,
    stackedColumnChartCategories: PropTypes.array.isRequired,
    spaceCategories: PropTypes.array.isRequired,
    xAxisObj: PropTypes.object.isRequired,
    timeZone: PropTypes.string.isRequired,
    dateFormat: PropTypes.string.isRequired,
    daysCount: PropTypes.number.isRequired,
    plotBandsProp: PropTypes.array.isRequired,
    upperLegendsProps: PropTypes.object.isRequired,
    onMoreDetail: PropTypes.func.isRequired,
    isChartLoading: PropTypes.bool.isRequired,
    propTitle: PropTypes.string.isRequired,
    propSubTitle: PropTypes.string.isRequired,
};

EnergyConsumptionBySpaceCategories.propTypes = {
    spacesData: PropTypes.array.isRequired,
};

export default EnergyConsumptionBySpaceChart;
