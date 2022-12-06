export const onHoverHandler = (data, hoveredPointIndex) => {
    data.forEach(function (point) {
        if (point.index !== hoveredPointIndex) {
            point.update({
                opacity: 0.3,
            });
        } else {
            point.update({
                opacity: 1,
            });
        }
    });
};

export const onUnHoverHandler = (data, hoveredPointIndex) => {
    data.forEach(function (point) {
        if (point.index !== hoveredPointIndex) {
            point.update({
                opacity: 1,
            });
        }
    });
};
