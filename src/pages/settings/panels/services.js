import axiosInstance from '../../../services/axiosInstance';
import { generalPanels } from '../../../services/Network';

export function getPanelsData(params) {
    return axiosInstance.get(`${generalPanels}${params}`).then((res) => res);
}
