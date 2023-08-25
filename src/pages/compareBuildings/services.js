import axiosInstance from '../../services/axiosInstance';
import { compareBuildingsV2 } from '../../services/Network';

export function fetchCompareBuildingsV2(params) {
    return axiosInstance.get(`${compareBuildingsV2}${params}`).then((res) => res);
}
