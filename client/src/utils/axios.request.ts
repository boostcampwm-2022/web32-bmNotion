import axios, { AxiosResponse } from 'axios';

export const axiosGetRequest = (
  url: string,
  successCallback: (res: AxiosResponse) => any,
  failCallback: (error: AxiosResponse) => any,
  headers: any | undefined,
) => {
  const request = () => {
    axios
      .get(url, {
        headers,
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.code === '202') {
          successCallback(res);
        } else if (res.data.code === '100') {
          localStorage.setItem('jwt', res.data.authorize);
          request();
        } else {
          failCallback(res);
        }
      })
      .catch((error) => {});
  };
  request();
};

export const axiosDeleteRequest = (
  url: string,
  successCallback: (res: AxiosResponse) => any,
  failCallback: (error: AxiosResponse) => any,
  headers: any | undefined,
) => {
  const request = () => {
    axios
      .delete(url, {
        headers,
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.code === '202') {
          successCallback(res);
        } else if (res.data.code === '100') {
          localStorage.setItem('jwt', res.data.authorize);
          request();
        } else {
          failCallback(res);
        }
      })
      .catch((error) => {});
  };
  request();
};

export const axiosPostRequest = (
  url: string,
  successCallback: (res: AxiosResponse) => any,
  failCallback: (error: AxiosResponse) => any,
  body: any | undefined,
  headers?: any | undefined,
) => {
  const request = () => {
    axios
      .post(url, body, {
        headers,
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.code === '202') {
          successCallback(res);
        } else if (res.data.code === '100') {
          localStorage.setItem('jwt', res.data.authorize);
          request();
        } else {
          failCallback(res);
        }
      })
      .catch((error) => {});
  };
  request();
};
