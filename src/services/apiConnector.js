import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://ed-tech-v1.onrender.com", // Change the base URL to http://localhost:4000 for local
});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
