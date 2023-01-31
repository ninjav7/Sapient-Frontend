// @flow
import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILED,
    LOGOUT_USER,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILED,
    FORGET_PASSWORD,
    FORGET_PASSWORD_SUCCESS,
    FORGET_PASSWORD_FAILED,
    GOOGLE_LOGIN_USER,
} from './constants';

export const loginUser = (username, password) => ({
    type: LOGIN_USER,
    payload: { username, password },
});
export const googleLoginUser = (sessionId) => ({
    type: GOOGLE_LOGIN_USER,
    payload: { sessionId },
});

export const loginUserSuccess = (user) => ({
    type: LOGIN_USER_SUCCESS,
    payload: user,
});

export const loginUserFailed = (error) => ({
    type: LOGIN_USER_FAILED,
    payload: error,
});

export const registerUser = (fullname, email, password, user_id, vendor) => ({
    type: REGISTER_USER,
    payload: { fullname, email, password, user_id, vendor },
});

export const registerUserSuccess = (user) => ({
    type: REGISTER_USER_SUCCESS,
    payload: user,
});

export const registerUserFailed = (error) => ({
    type: REGISTER_USER_FAILED,
    payload: error,
});

export const logoutUser = (history) => ({
    type: LOGOUT_USER,
    payload: { history },
});

export const forgetPassword = (username) => ({
    type: FORGET_PASSWORD,
    payload: { username },
});

export const forgetPasswordSuccess = (passwordResetStatus) => ({
    type: FORGET_PASSWORD_SUCCESS,
    payload: passwordResetStatus,
});

export const forgetPasswordFailed = (error) => ({
    type: FORGET_PASSWORD_FAILED,
    payload: error,
});
