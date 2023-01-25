import axiosInstance from '../../services/axiosInstance';
import { forgotUserPassword, googleSignIn, sessionValidator, updateUsers } from '../../services/Network';

export function forgotPassword(payload) {
    return axiosInstance.post(`${forgotUserPassword}`, payload).then((res) => {
        return res;
    });
}

export function googleAuth() {
    return axiosInstance.get(`${googleSignIn}`).then((res) => {
        return res;
    });
}

export function fetchSessionDetails(params) {
    return axiosInstance.get(`${sessionValidator}${params}`).then((res) => res);
}

export function updateUser(payload) {
    return axiosInstance.patch(`${updateUsers}`, payload).then((res) => res);
}
