import { useEffect, useReducer } from 'react';
import { ACTIONS, ACCESSORS } from './constants';
import _ from 'lodash';

const initialState = { floors: [], [ACCESSORS.SPACES]: [], stack: {}, spaces: [] };

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.GET_FLOORS: {
            const { floors } = action.payload;

            return {
                ...state,
                floors,
            };
        }
        case ACTIONS.GET_SPACES: {
            const { spaces } = action.payload;

            return {
                ...state,
                spaces,
            };
        }
        case ACTIONS.PUSH_INTO_STACK: {
            // Maybe we need initially put floors as "0"
            // rewrite it in future
            // we clean stack if user travels through levels
            const stackKeys = Object.keys(state.stack);
            const cleanedStackKeys = stackKeys.filter((val) => val >= action.payload.key);
            const cleanedStack = _.omit(state.stack, cleanedStackKeys);

            return {
                ...state,
                //component, key ......
                stack: { ...cleanedStack, [action.payload.key]: action.payload },
            };
        }
        default:
            throw new Error();
    }
}

const useStateManager = (componentProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { floors, spaces } = componentProps;

    useEffect(() => {
        floors &&
            dispatch({
                type: ACTIONS.GET_FLOORS,
                payload: { floors },
            });
    }, [floors]);

    useEffect(() => {
        spaces &&
            dispatch({
                type: ACTIONS.GET_SPACES,
                payload: { spaces },
            });
    }, [spaces]);

    return {
        state,
        dispatch,
    };
};

export default useStateManager;
