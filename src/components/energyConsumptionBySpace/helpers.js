import { fetchEnergyConsumptionBySpace } from './services';
import { DATAVIZ_COLORS } from '../../constants/colors';

export const fetchEnergyConsumptionBySpaceDataHelper = async ({ query, spacesDataCategories }) => {
    const spaces = await fetchEnergyConsumptionBySpace(query);

    if (!(Array.isArray(spaces) && spaces.length > 0)) throw new Error();

    const newSpacesData = [];
    const newSpacesColumnCategories = [];
    const newSpacesColumnChartData = [];
    const newSpacesDataCategories = [];

    spaces.forEach((space, index) => {
        const { name, space_id } = space;

        let color = DATAVIZ_COLORS[`datavizMain${index + 1}`];

        if (!color) color = DATAVIZ_COLORS[`datavizMain${Math.floor(Math.random() * (9 - 1 + 1) + 1)}`];

        const spaceData = { name, space_id, color };
        const spaceColumnData = { name, data: [] };

        const data = space?.data && Array.isArray(space.data) ? space.data : [];

        data.forEach((data) => {
            if (index === 0) newSpacesColumnCategories.push(data?.time_stamp);

            spaceColumnData.data.push(
                isNaN(data?.consumption) ? data?.consumption : parseFloat((data?.consumption / 1000).toFixed(2))
            );
        });

        newSpacesData.push(spaceData);
        newSpacesColumnChartData.push(spaceColumnData);
        newSpacesDataCategories.push(color);
    });

    const result = { newSpacesColumnCategories, newSpacesData, newSpacesColumnChartData, newSpacesDataCategories };

    return result;
};
