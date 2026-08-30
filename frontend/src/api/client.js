import axios from "axios";

const ACCESS_KEY = "monarch_access_token";
const REFRESH_KEY = "monarch_refresh_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export const api = axios.create({
  baseURL: "/api/v1/",
});

// Attach the current access token to every request.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, try exactly once to refresh the access token before giving up
// and forcing the user back to the login page.
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    if (!response || response.status !== 401 || config._retried) {
      throw error;
    }
    const refresh = getRefreshToken();
    if (!refresh) {
      clearTokens();
      throw error;
    }

    config._retried = true;
    try {
      refreshPromise =
        refreshPromise ||
        axios.post("/api/v1/auth/token/refresh/", { refresh });
      const { data } = await refreshPromise;
      setTokens({ access: data.access });
      config.headers.Authorization = `Bearer ${data.access}`;
      return api.request(config);
    } catch (refreshError) {
      clearTokens();
      throw refreshError;
    } finally {
      refreshPromise = null;
    }
  }
);

export async function login(username, password) {
  const { data } = await axios.post("/api/v1/auth/token/login/", {
    username,
    password,
  });
  setTokens(data);
  return data;
}

export function logout() {
  clearTokens();
}
