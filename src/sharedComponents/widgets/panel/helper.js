import { Breaker } from '../../breaker';
import { PREFIXES_TO_BREAKERS_VALUES } from './constants';

/***
 * Just extracts id as integer.
 * @param id - String, id with text, like: 'Breaker-1'.....
 * @returns {number} - Integer is always positive.
 */
const getNumberOfBreaker = (id) => parseFloat(String(id).replace(/[a-z]|-/g, ''));

/**
 * Edges to connect breakers.
 * @typedef {Object} Edges
 * @property {Object[]} edges - Edges to connect breakers.
 * @property {string} edges[].id - The id of the edge.
 * @property {string} edges[].source - The source breaker to be connected as child.
 * @property {string} edges[].target - The target breaker to be connected as parent.
 */

/***
 * Sorts edges.
 * @param {Edges} edges
 * @returns {Edges} - Sorted list of edges
 */
const sortEdges = (edges) => [...edges].sort((a, b) => getNumberOfBreaker(a.id) - getNumberOfBreaker(b.id));

/***
 * Takes edges {source: ...., target: ....} and creates grouped linked lists.
 * @param {Edges} edges
 * @returns {Object.<string, Array.<{id: String, source: String, target: String}>>} - The lined list of edges
 */
const groupEdgesToColumns = (edges) => {
    const duplicateEdges = sortEdges(edges);
    const output = {};
    let index = 0;

    while (duplicateEdges.length) {
        let trg = duplicateEdges[index]?.target;
        output[output[index] ? ++index : index] = [duplicateEdges[0]];
        duplicateEdges.splice(0, 1);

        while (trg) {
            const nextItemIndex = duplicateEdges.findIndex((item) => item.source === trg);
            const nextItem = duplicateEdges[nextItemIndex];

            if (nextItemIndex !== -1) {
                duplicateEdges.splice(nextItemIndex, 1);
                output[index].push(nextItem);
            }

            trg = nextItem?.target;
        }
    }

    return output;
};

/**
 * Props for breakers
 * @typedef {Object} BreakerProps
 * @property {Array.<Object.<{id: number, status: string, deviceId: string, sensorId: string}>>} items - Items props for breaker
 * @property {string} ratedAmps - Amps
 * @property {string} ratedVolts - Volts
 * @property {string} equipmentName - Equipment name
 * @property {function} onEdit - Callback for breaker's edit event
 * @property {function} onShowChart - Callback for breaker's show chart event
 * @property {boolean} isFlagged - Make breaker as flagged
 * @property {string} type - Type of breaker
 */

/**
 * Extracts properties by accessors from object, adds 'items' by ['id', 'status', 'sensorId', 'deviceId'] kyes.
 * @param {Array.<Array.<number>>} propsAccessor - Array with keys and name of property should be extracted.
 * @param {Object} props - Object with properties and values, will be extracted, proportions which aren't in accessors list will be skipped.
 * @returns {BreakerProps}
 */

const mergePropsByAccessors = (propsAccessor, props = {}) => {
    const breakerItem = {};

    return propsAccessor.reduce(
        (propsAcc, [keyAccessors, propName]) => {
            // here might be '0'
            if (props[propName] === undefined) {
                return propsAcc;
            }

            const prefix = PREFIXES_TO_BREAKERS_VALUES[keyAccessors] || '';
            const currentValue = prefix ? `${props[propName]} ${prefix}` : props[propName];

            if (Breaker.ItemsPropMap.includes(keyAccessors)) {
                breakerItem[keyAccessors] = currentValue;
            } else {
                propsAcc[keyAccessors] = currentValue;
            }

            return propsAcc;
        },
        { items: [breakerItem] }
    );
};

export { mergePropsByAccessors, groupEdgesToColumns, getNumberOfBreaker, sortEdges };
