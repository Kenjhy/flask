import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';
const API_URL = 'http://127.0.0.1:5000/api';

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

export const getStates = () => {
    return axios.get(`${API_URL}/states`);
};

export const getRatings = () => {
    return axios.get(`${API_URL}/ratings`);
};