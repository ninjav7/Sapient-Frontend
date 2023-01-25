const ACTIONS = Object.freeze({
    GET_FLOORS: 'GET_FLOORS',
    GET_SPACES: 'GET_SPACES',
    PUSH_INTO_STACK: 'PUSH_INTO_STACK',
});

const LEVELS = Object.freeze({
    FLOOR: 'FLOOR',
    SPACE: 'SPACE',
});

const ACCESSORS = Object.freeze({
    FLOOR_ID: 'floor_id',
    NAME: 'name',
    SPACE_ID: '_id',
    PARENT_SPACE: 'parent_space',
    SPACES: 'spaces',
});

export { ACTIONS, LEVELS, ACCESSORS };
