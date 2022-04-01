import axios from 'axios';
import {IDashboard, IDashboardQuery} from '../types/dashboard';
import {IResponse} from '../types/queries';

export const queryDashboard = (query: IDashboardQuery) => {
  const axiosRequestConfig = {params: query};
  return axios
      .get<IResponse<IDashboard>>('api/dashboard', axiosRequestConfig)
      .then((axiosResponse) => axiosResponse.data.Results[0]);
};

export const saveDashboard = (dashboard: IDashboard) => {
  const body = dashboard;
  return axios
      .post<string>('api/dashboard', body)
      .then((axiosResponse) => axiosResponse.data);
};
