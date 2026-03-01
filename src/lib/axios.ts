import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MockEndPoints } from "__server__";

// Axios instance
const axiosInstance = axios.create({
  // baseURL: "/remote-api",
  timeout: 20000,
});

// Basic retry mechanism
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!config || !config.retry) config.retry = 0;

    // Retry up to 2 times for timeouts or server errors
    if (config.retry < 2 && (error.code === 'ECONNABORTED' || (error.response && error.response.status >= 500))) {
      config.retry += 1;
      console.log(`Retrying request (${config.retry}): ${config.url}`);
      return axiosInstance(config);
    }
    return Promise.reject(error);
  }
);

// Remove following 2 lines if you don't want to use MockAdapter
export const Mock = new MockAdapter(axiosInstance);
MockEndPoints(Mock);

export default axiosInstance;
