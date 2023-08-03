const formattedXaxisObj = (ticket_amount) => {
    let xaxisObj = {
        xAxis: {
            tickPositioner: function () {
                var positions = [],
                    tick = Math.floor(this.dataMin),
                    increment = Math.ceil((this.dataMax - this.dataMin) / ticket_amount);
                if (this.dataMax !== null && this.dataMin !== null) {
                    for (tick; tick - increment <= this.dataMax; tick += increment) {
                        positions.push(tick);
                    }
                }
                return positions;
            },
        },
    };
    return xaxisObj;
};

export const xaxisLabelsCount = (daysCount) => {
    // Up to and including 1 day
    if (daysCount === 1) {
        return formattedXaxisObj(8);
    }

    // Up to and including 3 days
    if (daysCount >= 2 && daysCount <= 3) {
        return formattedXaxisObj(daysCount * 4);
    }

    // Up to and including 7 days
    if (daysCount >= 4 && daysCount <= 7) {
        return formattedXaxisObj(daysCount * 2);
    }

    // Up to and including 14 days
    if (daysCount >= 8 && daysCount <= 14) {
        return formattedXaxisObj(daysCount);
    }

    // Up to and including 30 days
    if (daysCount >= 15 && daysCount <= 30) {
        return formattedXaxisObj((daysCount / 3).toFixed(0));
    }

    // Up to and including 3 Months
    if (daysCount >= 31 && daysCount <= 90) {
        return formattedXaxisObj((daysCount / 6).toFixed(0));
    }

    // Up to and including 6 Months
    if (daysCount >= 91 && daysCount <= 181) {
        return formattedXaxisObj((daysCount / 6).toFixed(0));
    }

    // >6 Months
    if (daysCount >= 182) {
        return formattedXaxisObj((daysCount / 30).toFixed(0));
    }
};

export const xaxisLabelsFormat = (daysCount, timeFormat = `12h`) => {
    // Up to and including 1 day
    if (daysCount === 1) return timeFormat === `12h` ? `hh:00 A` : `HH:00`;

    // Up to and including 3 days
    if (daysCount >= 2 && daysCount <= 3) return 'MM/DD HH:00';

    // Up to and including 7 days
    if (daysCount >= 4 && daysCount <= 7) return 'MM/DD HH:00';

    // Up to and including 14 days
    if (daysCount >= 8 && daysCount <= 14) return 'MM/DD';

    // Up to and including 30 days
    if (daysCount >= 15 && daysCount <= 30) return 'MM/DD';

    // Up to and including 3 Months
    if (daysCount >= 31 && daysCount <= 90) return 'MM/DD';

    // Up to and including 6 Months
    if (daysCount >= 91 && daysCount <= 181) return 'MM/DD';

    // >6 Months
    if (daysCount >= 182) return `MMM 'YY`;
};
