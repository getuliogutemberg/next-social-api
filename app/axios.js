import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Defina a URL base correta para o seu servidor
});

export default instance;