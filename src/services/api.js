import axios from 'axios';

export default axios.create({
  //baseURL: config.baseURL_API
  baseURL: 'http://localhost:4000'
});