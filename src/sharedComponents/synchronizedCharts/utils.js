import { DATAVIZ_COLORS } from '../../constants/colors';

export const getColorBasedOnIndex = (index = 0) => {
    return DATAVIZ_COLORS[`datavizMain${index + 1}`];
};
