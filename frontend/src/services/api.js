import axios from "axios";

const LEGACY_RAILWAY_API_URL = "https://catedral-erpp-production.up.railway.app";
const PRODUCTION_API_URL = "https://api.catedralerp.com.br";
const LOCAL_API_URL = "http://127.0.0.1:8000";

function resolveApiBaseUrl() {
  const configuredUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

  if (!import.meta.env.PROD) {
    return configuredUrl || LOCAL_API_URL;
  }

  if (!configuredUrl || configuredUrl === LEGACY_RAILWAY_API_URL) {
    return PRODUCTION_API_URL;
  }

  return configuredUrl;
}

const API = axios.create({
  baseURL: resolveApiBaseUrl(),
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("catedral_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("catedral_token");
      localStorage.removeItem("catedral_user");
      window.dispatchEvent(new Event("catedral:logout"));
    }

    return Promise.reject(error);
  }
);

export default API;
