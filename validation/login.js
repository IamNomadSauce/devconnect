const validator = require('validator');
const isEmpty = require('./is-Empty');
module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if(!validator.isEmail(data.email)) {
    errors.email = 'EMAIL is INVALID';
  }
  if(validator.isEmpty(data.email)) {
    errors.email = 'EMAIL is REQUIRED';
  }
  if(validator.isEmpty(data.password)) {
    errors.password = 'PASSWORD is Required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
