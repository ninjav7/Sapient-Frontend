import colors from '../../../../assets/scss/_colors.scss';

const useWeatherLegends = () => {
    return {
        renderWeatherLegends: [
            {
                label: 'Weather',
                styles: { background: colors.datavizDark8, border: `0.0625rem solid ${colors.primaryGray500}` },
            },
        ],
    };
};

export { useWeatherLegends };
