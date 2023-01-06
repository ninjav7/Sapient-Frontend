import axiosInstance from '../../../services/axiosInstance';
import {
    addMemberUser,
    getMemberUser,
    vendorPermissions,
    getSingleUserDetail,
    updateSingleUserDetail,
    updateUserRole,
    getUserFilters,
} from '../../../services/Network';

export function inviteMemberUsers(payload, params) {
    return axiosInstance.post(`${addMemberUser}${params}`, payload).then((res) => res);
}

export function fetchMemberUserList(params) {
    return axiosInstance.get(`${getMemberUser}${params}`).then((res) => res);
}

export function fetchUserFilters(params) {
    return axiosInstance.get(`${getUserFilters}${params}`).then((res) => res);
}

export function updateVendorPermissions(payload, params) {
    return axiosInstance.post(`${vendorPermissions}${params}`, payload).then((res) => res);
}

export function fetchSingleUserDetail(params) {
    return axiosInstance.get(`${getSingleUserDetail}${params}`).then((res) => res);
}

export function updateSingleUserDetails(payload, params) {
    return axiosInstance.patch(`${updateSingleUserDetail}${params}`, payload).then((res) => res);
}

export function updateUserRolePermission(payload) {
    return axiosInstance.patch(`${updateUserRole}`, payload).then((res) => res);
}
