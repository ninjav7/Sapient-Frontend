import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/pro-regular-svg-icons';
import LineAreaChart from './LineAreaChart';
import Typography from '../../sharedComponents/typography';
import { getAreaChartCSVExport } from '../../sharedComponents/helpers/chartsExport';
import './dailyUsageByHour.scss';

const Titles = ({ title, subtitle }) => {
    return (
        <>
            <div className="ml-3 mt-2">
                <Typography.Subheader
                    size={Typography.Sizes.md}
                    as="h5"
                    fontWeight={Typography.Types.SemiBold}
                    className="mb-1">
                    {title}
                </Typography.Subheader>
                <Typography.Body size={Typography.Sizes.xs} as="h6">
                    {subtitle}
                </Typography.Body>
            </div>
        </>
    );
};

const DailyUsageByHour = ({ title, subtitle, options, series, className = '' }) => {
    return (
        <div className={`daily-usage-by-hour-wrapper ${className}`}>
            <div className="d-flex justify-content-between">
                <Titles {...{ title, subtitle }} />
                <FontAwesomeIcon
                    icon={faDownload}
                    size="md"
                    className="download-chart-btn mouse-pointer mr-3 mt-3"
                    onClick={() => getAreaChartCSVExport(series)}
                />
            </div>
            <div>
                <LineAreaChart options={options} series={series} height={400} />
            </div>
        </div>
    );
};

export default DailyUsageByHour;
