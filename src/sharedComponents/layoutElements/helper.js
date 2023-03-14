import _ from 'lodash';
import { MAP_PROPERTIES_ACTIONS } from './constants';

export const getActionRestrictionsItem = (actionsMap) =>
    actionsMap || {
        isEditable: true,
    };

export const getActionRestrictionsColumn = (actionsMap) =>
    actionsMap || {
        isEditable: true,
        canChangeName: true,
        canAddNewSpace: true,
        canFilter: true,
    };

/**
 * Takes map of restrictions and return appropriate values for corresponded callbacks.
 * @param actionsMap {{isEditable: boolean | object, canChangeName: boolean | object, canAddNewSpace: boolean | object, canFilter: boolean | object }} - Map with restrictions.
 * @param isColumn {boolean} - Item is column or item
 * @returns {{[p: string]: boolean}|*} - Map with callbacks with false values.
 */
export const getActionRestrictions = (actionsMap, isColumn) => {
    if (isColumn) {
        const restrictionRules = getActionRestrictionsColumn(actionsMap);

        return Object.entries(restrictionRules).reduce((acc, [key, restrictValue]) => {
            const isCurrentValueObject = _.isObject(restrictValue);
            //extract value from object or returns value itself
            const currentValue = isCurrentValueObject ? restrictValue?.value : restrictValue;
            //we don't put prop if it is undefined
            const includeChildren = isCurrentValueObject
                ? {
                      [`${MAP_PROPERTIES_ACTIONS[key]}IncludeChildren`]: restrictValue?.includeChildren,
                  }
                : {};

            //we don't include prop if `value` is true, it doesn't make sense
            return currentValue ? acc : { ...acc, [MAP_PROPERTIES_ACTIONS[key]]: currentValue, ...includeChildren };
        }, {});
    }

    //get value from object or get that object itself
    const isEditable = _.isObject(actionsMap?.isEditable) ? { isEditable: actionsMap.isEditable?.value } : actionsMap;

    return getActionRestrictionsItem(!_.isEmpty(isEditable) && isEditable);
};
