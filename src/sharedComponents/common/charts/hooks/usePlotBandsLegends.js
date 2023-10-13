import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

import { PLOT_BANDS_TYPE } from '../modules/contants';
import colors from '../../../../assets/scss/_colors.scss';

const usePlotBandsLegends = ({ plotBandsProp, plotBandsLegends }) => {
    const [plotBands, setPlotBands] = useState(plotBandsProp);

    useEffect(() => {
        setPlotBands(plotBandsProp);
    }, [plotBandsProp]);
    const renderPlotBandsLegends = useCallback(
        plotBandsLegends?.map((plotLegend) => {
            let styles;

            let label, color, onClick;

            switch (plotLegend.type) {
                case PLOT_BANDS_TYPE.off_hours:
                    {
                        label = 'Plug Rule Off-Hours';
                        color = 'rgb(16 24 40 / 25%)';
                        onClick = (disabled) => {
                            setPlotBands((oldState) =>
                                disabled
                                    ? oldState.filter((data) => data.type !== PLOT_BANDS_TYPE.off_hours)
                                    : [
                                          ...oldState,
                                          ...plotBandsProp.filter((data) => data.type === PLOT_BANDS_TYPE.off_hours),
                                      ]
                            );
                        };
                        styles = {
                            background: color,
                        };
                    }
                    break;
                case PLOT_BANDS_TYPE.after_hours:
                    {
                        label = 'After-Hours';
                        color = {
                            background: 'rgba(180, 35, 24, 0.1)',
                            borderColor: colors.error700,
                        };
                        onClick = (disabled) => {
                            setPlotBands((oldState) =>
                                disabled
                                    ? oldState.filter((data) => data.type !== PLOT_BANDS_TYPE.after_hours)
                                    : [
                                          ...oldState,
                                          ...plotBandsProp.filter((data) => data.type === PLOT_BANDS_TYPE.after_hours),
                                      ]
                            );
                        };
                        styles = {
                            background: color.background,
                            border: `0.0625rem solid ${color.borderColor}`,
                        };
                    }
                    break;
                default: {
                    label = plotLegend.label;
                    color = plotLegend.color;
                    onClick = plotLegend.onClick;

                    styles =
                        typeof color === 'string'
                            ? {
                                  background: color,
                              }
                            : {
                                  background: color.background,
                                  border: `0.0625rem solid ${color.borderColor}`,
                              };
                }
            }

            return { onClick, label, styles, type: plotLegend.type };
        }),
        []
    );

    return { plotBands, renderPlotBandsLegends };
};

export { usePlotBandsLegends };
