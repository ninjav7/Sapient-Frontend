import React from 'react';
import Typography from '../../../typography';

import { renderComponents } from '../../../columnChart/helper';

import './lowmedhigh.scss';

const tooltipLowMedHighTemplate = ({ median, low, high, unitTemp }) => {
    const tempInfo = renderComponents(
        <div className="tooltip-low-med-high">
            <div className="d-flex align-items-center justify-content-center">
                {median && (
                    <>
                        <Typography.Body size={Typography.Sizes.xxs} className="gray-450">
                            Avg
                        </Typography.Body>
                        <div style={{ width: '0.25rem' }} />
                        <Typography.Subheader size={Typography.Sizes.md} className="gray-900">
                            {median}
                        </Typography.Subheader>
                    </>
                )}
                {unitTemp && unitTemp && (
                    <Typography.Body size={Typography.Sizes.xxs} className="gray-550">
                        {unitTemp}
                    </Typography.Body>
                )}
            </div>

            {low && high && (
                <div className="d-flex">
                    {low && (
                        <div className="d-flex align-items-center justify-content-center">
                            <div className="tooltip-low-med-high-min-temp" />
                            <div style={{ width: '0.25rem' }} />
                            <Typography.Body size={Typography.Sizes.xxs}>{low}</Typography.Body>
                            <Typography.Body size={Typography.Sizes.xxs} className="gray-550">
                                {unitTemp}
                            </Typography.Body>
                        </div>
                    )}

                    <div style={{ width: '0.328125rem' }} />

                    {high && (
                        <div className="d-flex  align-items-center ">
                            <div className="tooltip-low-med-high-max-temp" />
                            <div style={{ width: '0.25rem' }} />
                            <Typography.Body size={Typography.Sizes.xxs}>{high}</Typography.Body>
                            <Typography.Body size={Typography.Sizes.xxs} className="gray-550">
                                {unitTemp}
                            </Typography.Body>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return `<tr><td colspan='2'>${tempInfo}</td></tr>`;
};

export { tooltipLowMedHighTemplate };
