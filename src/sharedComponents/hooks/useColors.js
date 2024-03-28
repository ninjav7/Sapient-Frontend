import { useRef } from 'react';
import { DATAVIZ_COLORS } from '../../constants/colors';

const useColors = () => {
    const elementsColor = useRef([]);

    const getColor = (elementId) => {
        const element = elementsColor.current.find(({ id }) => id === elementId);

        if (!!element) {
            return element.color;
        }

        const color = DATAVIZ_COLORS[`datavizMain${elementsColor.current.length + 1}`];

        const newElement = { color, id: elementId };

        elementsColor.current.push(newElement);

        return newElement.color;
    };

    return { colors: elementsColor, getColor };
};

export default useColors;
