import { Store } from 'pullstate';

export const ROUTE_LEVELS = Object.freeze({
    PORTFOLIO: 'PORTFOLIO',
    BUILDINGS: 'BUILDINGS',
});

export const ComponentStore = new Store({
    parent: 'buildings',
    level: localStorage.getItem('levelRoute') || ROUTE_LEVELS.PORTFOLIO,
});

//  ---------- Options: ----------
// portfolio
// buildings
// control
// explore
// account
// building-settings
