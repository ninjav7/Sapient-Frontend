import axiosInstance from '../../../services/axiosInstance';
import { updateVendor } from '../../../services/Network';

export function updateVendorName(params, payload) {
    return axiosInstance.patch(`${updateVendor}${params}`, payload).then((res) => res);
}
