import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getCompanies = () => {
    return axios.get(`${API_URL}/companies`);
};

export const deleteCompany = (id) => {
    return axios.delete(`${API_URL}/companies/${id}`);
};

export const addCompany = (companyData) => {
    return axios.post(`${API_URL}/companies`, companyData);
};

export const updateCompany = (id, companyData) => {
    return axios.put(`${API_URL}/companies/${id}`, companyData);
};