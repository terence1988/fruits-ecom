import axios from "axios";

export default {
  saveCustomerSignUpForm: function (signUpData) {
    return axios.post('/signup', signUpData)
      .then(data => window.location = '/signin');
  },

  logInCustomer: function (logInData) {
    return axios.post('/login', logInData)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
        if (error) {
          alert('Incorrect username or password');
          return;
        }
      });
  },

  logOutCustomer: function () {
    return axios.get('/logout ')
      .then(localStorage.removeItem('user'))
      .catch(error => {
        console.log(error)
      })
  }
};