// @flow

import { combineReducers } from 'redux';
import Layout from './layout/reducers';
import Auth from './auth/reducers';
import AppMenu from './appMenu/reducers';
import counterReducer from './building/reducers';
import breadCrumbItemsReducer from './breadcrumb/reducers';

export default combineReducers({
    Auth,
    AppMenu,
    Layout,
    counterState: counterReducer,
    breadCrumbState: breadCrumbItemsReducer,
});
