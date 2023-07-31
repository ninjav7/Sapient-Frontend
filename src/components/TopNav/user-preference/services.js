import { updateUserProfile } from '../../../services/Network';
import axiosInstance from '../../../services/axiosInstance';

export function updateUserPreferences(params, payload) {
    return axiosInstance.put(`${updateUserProfile}${params}`, payload).then((res) => res);
}
