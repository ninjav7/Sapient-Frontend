import { splat } from 'highcharts';
import { LOW_MED_HIGH } from '../common/charts/modules/contants';
import { tooltipLowMedHighTemplate } from '../common/charts/modules/tooltipLowMedHighTemplate';
import { UNITS } from '../../constants/units';

const highchartsAddLowMedHighToTooltip = (H) => {
    H.wrap(H.Tooltip.prototype, 'defaultFormatter', function (proceed, tooltip) {
        const { items, lowmedhigh } = splat(this.points).reduce(
            (acc, item) => {
                const isLowMedHighGroup = item.series?.userOptions?.group !== LOW_MED_HIGH;
                const typeOfValue = item.series?.userOptions?.typeOfValue;

                if (isLowMedHighGroup) {
                    acc.items.push(item);
                } else {
                    acc[LOW_MED_HIGH][typeOfValue] = item.y;
                }

                return acc;
            },
            { items: [], [LOW_MED_HIGH]: {} }
        );

        let s;

        // Build the header
        s = [tooltip.tooltipFooterHeaderFormatter(items[0])];

        // build the values
        s = s.concat(tooltip.bodyFormatter(items));

        if (Object.keys(lowmedhigh).length) {
            const lomMedHighHtml = tooltipLowMedHighTemplate({
                ...lowmedhigh,
                median: lowmedhigh.med,
                unitTemp: UNITS.F,
            });

            s.push(lomMedHighHtml);
        }

        // footer
        s.push(tooltip.tooltipFooterHeaderFormatter(items[0], true));

        return s;
    });
};

export { highchartsAddLowMedHighToTooltip };
