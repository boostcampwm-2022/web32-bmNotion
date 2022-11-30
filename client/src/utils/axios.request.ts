import axios, { AxiosResponse } from 'axios';

const axiosGetRequest = (
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
      .catch((error) => {
        console.log(error);
      });
  };
  request();
};

const axiosPostRequest = (
  url: string,
  successCallback: (res: AxiosResponse) => any,
  failCallback: (error: AxiosResponse) => any,
  body: any | undefined,
  headers: any | undefined,
) => {
  const request = () => {
    axios
      .post(url, {
        headers,
        body,
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
      .catch((error) => {
        console.log(error);
      });
  };
  request();
};

export default { axiosGetRequest, axiosPostRequest };
