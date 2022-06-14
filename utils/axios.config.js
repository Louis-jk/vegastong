import axios from 'axios';
import Config from 'react-native-config';

axios.defaults.baseURL = Config.BASE_URL;

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';
axios.defaults.headers.post['api-secret'] = Config.API_SECRET;

export const VegasPost = (url, data, header) => {
  console.log('VegasPost header ??', header);
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, header)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
        console.log(err);
      });
  });
};

export const VegasGet = (url, header) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, header || null)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
        console.log(err);
      });
  });
};
