import axiosInstance from '../../services/axiosInstance';
import {
    portfolioBuilidings,
    portfolioEndUser,
    portfolioOverall,
    getEnergyConsumption,
} from '../../services/Network';


export function fetchPortfolioBuilidings(payload) {
    return axiosInstance.post(`${portfolioBuilidings}`, payload).then((res) => res);
}

export function fetchPortfolioOverall(payload) {
    return axiosInstance.post(`${portfolioOverall}`, payload).then((res) => res);
}

export function fetchPortfolioEndUse(payload) {
    return axiosInstance.post(`${portfolioEndUser}`, payload).then((res) => res);
}

export function fetchPortfolioEnergyConsumption(payload) {
    return axiosInstance.post(`${getEnergyConsumption}`, payload).then((res) => res);
}