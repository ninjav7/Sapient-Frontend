import axiosInstance from '../../services/axiosInstance';
import { forgotUserPassword } from '../../services/Network';

export function forgotPassword(payload) {
    return axiosInstance.post(`${forgotUserPassword}`, payload).then((res) => {
        return res;
    });
}
