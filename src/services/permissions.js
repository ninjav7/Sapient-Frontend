import axiosInstance from '../../services/axiosInstance';
import { singleUserPermissionDetail } from '../../services/Network';

export function fetchPermissions() {
    return axiosInstance.get(`${singleUserPermissionDetail}`).then((res) => res);
}
