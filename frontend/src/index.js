import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css'
import axios from 'axios'

// axios configs
axios.interceptors.request.use(function (config) {
  const currentUser = JSON.parse(window.localStorage.getItem('currentUser'))
  if (currentUser?.token) config.headers.Authorization = `Bearer ${currentUser.token}`

  return config
})

axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  console.log(error)
  if (error.response.status === 401 && error.response.data.error === "Token expired") {
    window.localStorage.removeItem('currentUser')
  }
  return Promise.reject(error);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
