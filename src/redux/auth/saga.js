// @flow
import { Cookies } from 'react-cookie';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { BaseUrl, signinV2, signup, sessionValidator } from '../../services/Network';
import { fetchJSON } from '../../helpers/api';

import { LOGIN_USER, LOGOUT_USER, REGISTER_USER, FORGET_PASSWORD, GOOGLE_LOGIN_USER } from './constants';

import {
    loginUserSuccess,
    loginUserFailed,
    registerUserSuccess,
    registerUserFailed,
    forgetPasswordSuccess,
    forgetPasswordFailed,
    logoutUser,
} from './actions';
import { UserStore } from '../../store/UserStore';

/**
 * Sets the session
 * @param {*} user
 */
const setSession = (user) => {
    let cookies = new Cookies();
    if (user) {
        console.log('SSR user => ', user);
        localStorage.setItem('vendorName', user?.vendor_name);
        localStorage.setItem('date_format', user?.date_format);
        localStorage.setItem('time_format', user?.time_format);
        localStorage.setItem('unit', user?.unit);
        cookies.set('user', JSON.stringify(user), { path: '/' });
    } else cookies.remove('user', { path: '/' });
};
/**
 * Login the user
 * @param {*} payload - username and password
 */
function* login({ payload: { username, password } }) {
    const options = {
        body: JSON.stringify({
            email: username,
            password: password,
        }),
        method: 'POST',
        headers: {
            'access-control-allow-origin': '*',
            'Content-type': 'application/json; charset=UTF-8',
            accept: 'application/json',
        },
    };

    try {
        const response = yield call(fetchJSON, `${BaseUrl}${signinV2}`, options);
        if (response.success === false) {
            localStorage.setItem('login_success', false);
            localStorage.setItem('failed_message', response.message);
            UserStore.update((s) => {
                s.message = response.message;
                s.loginSuccess = 'error';
            });
        } else {
            UserStore.update((s) => {
                s.loginSuccess = 'success';
            });
            localStorage.setItem('login_success', true);
        }
        setSession(response.data);
        yield put(loginUserSuccess(response.data));
    } catch (error) {
        let message;
        switch (error.status) {
            case 500:
                message = 'Internal Server Error';
                break;
            case 401:
                message = 'Invalid credentials';
                break;
            default:
                message = error;
        }

        yield put(loginUserFailed(message));
        setSession(null);
    }
}

function* Googlelogin({ payload: { sessionId } }) {
    const options = {
        method: 'GET',
        headers: {
            'access-control-allow-origin': '*',
            'Content-type': 'application/json; charset=UTF-8',
            accept: 'application/json',
        },
    };
    const params = `?session_id=${sessionId}`;
    try {
        const response = yield call(fetchJSON, `${BaseUrl}${sessionValidator}${params}`, options);
        if (response.success === false) {
            localStorage.setItem('login_success', false);
            localStorage.setItem('failed_message', response.message);
            UserStore.update((s) => {
                s.message = response.message;
                s.loginSuccess = 'error';
            });
        } else {
            UserStore.update((s) => {
                s.loginSuccess = 'success';
            });
            localStorage.setItem('login_success', true);
        }
        setSession(response.data);
        yield put(loginUserSuccess(response.data));
    } catch (error) {
        let message;
        switch (error.status) {
            case 500:
                message = 'Internal Server Error';
                break;
            case 401:
                message = 'Invalid credentials';
                break;
            default:
                message = error;
        }

        yield put(loginUserFailed(message));
        setSession(null);
    }
}

/**
 * Logout the user
 * @param {*} param0
 */
function* logout({ payload: { history } }) {
    try {
        setSession(null);
        yield put(logoutUser(history));
        yield call(() => {
            history.push('/account/login');
        });
    } catch (error) {}
}

/**
 * Register the user
 */
function* register({ payload: { fullname, email, password, user_id, vendor } }) {
    const options = {
        body: JSON.stringify({
            email: email,
            user_id: user_id,
            name: fullname,
            password: password,
            vendor: vendor,
        }),
        method: 'POST',
        headers: { 'access-control-allow-origin': '*', 'Content-type': 'application/json; charset=UTF-8' },
    };

    try {
        const response = yield call(fetchJSON, `${BaseUrl}${signup}`, options);
        if (response.success === true) {
            localStorage.setItem('signup_success', true);
        } else {
            localStorage.setItem('signup_success', false);
            localStorage.setItem('failed_message', response.message);
        }
        yield put(registerUserSuccess(response.data));
    } catch (error) {
        let message;
        switch (error.status) {
            case 500:
                message = 'Internal Server Error';
                break;
            case 401:
                message = 'Invalid credentials';
                break;
            default:
                message = error;
        }
        yield put(registerUserFailed(message));
    }
}

/**
 * forget password
 */
function* forgetPassword({ payload: { username } }) {
    const options = {
        body: JSON.stringify({ username }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        const response = yield call(fetchJSON, '/users/password-reset', options);
        yield put(forgetPasswordSuccess(response.message));
    } catch (error) {
        let message;
        switch (error.status) {
            case 500:
                message = 'Internal Server Error';
                break;
            case 401:
                message = 'Invalid credentials';
                break;
            default:
                message = error;
        }
        yield put(forgetPasswordFailed(message));
    }
}

export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, login);
}
export function* watchGoogleLoginUser() {
    yield takeEvery(GOOGLE_LOGIN_USER, Googlelogin);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, register);
}

export function* watchForgetPassword() {
    yield takeEvery(FORGET_PASSWORD, forgetPassword);
}

function* authSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchGoogleLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchForgetPassword),
    ]);
}

export default authSaga;
