import axiosInstance from '../../../services/axiosInstance';
import {
    addMemberUser,
    getMemberUser,
    vendorPermissions,
    getSingleUserDetail,
    updateSingleUserDetail,
} from '../../../services/Network';

export function addMemberUsers(payload = {}, params) {
    return axiosInstance.post(`${addMemberUser}${params}`, payload).then((res) => res);
}

export function getMemberUserList(payload = {}, params) {
    return axiosInstance.get(`${getMemberUser}${params}`, payload).then((res) => res);
}

export function updateVendorPermissions(payload = {}, params) {
    return axiosInstance.post(`${vendorPermissions}${params}`, payload).then((res) => res);
}

export function fetchSingleUserDetail(payload = {}, params) {
    return axiosInstance.get(`${getSingleUserDetail}${params}`, payload).then((res) => res);
}

export function updateSingleUserDetails(payload = {}, params) {
    return axiosInstance.patch(`${updateSingleUserDetail}${params}`, payload).then((res) => res);
}
