import axiosInstance from '../../../services/axiosInstance';
import { updateUserProfile } from '../../../services/Network';

export function updateUserPreferences(params, payload) {
    return axiosInstance.put(`${updateUserProfile}${params}`, payload).then((res) => res);
}
