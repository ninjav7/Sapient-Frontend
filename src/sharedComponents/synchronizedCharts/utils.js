import { DATAVIZ_COLORS } from '../../constants/colors';

export const getColorBasedOnIndex = (index) => {
    return DATAVIZ_COLORS[`datavizMain${index + 1}`];
};
