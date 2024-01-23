import colors from '../../../../assets/scss/_colors.scss';

const useWeatherLegends = () => {
    return {
        renderWeatherLegends: [
            {
                label: 'Weather',
                styles: { background: colors.datavizRed700 },
            },
        ],
    };
};

export { useWeatherLegends };
