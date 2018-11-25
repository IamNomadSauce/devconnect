const validator = require('validator');
const isEmpty = require('./is-Empty');
module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if(!validator.isLength(data.name, { min: 2, max: 30 })){
    errors.name = 'NAME MUST BE BETWEEN 2 AND 30 CHARACTERS';
  }

  if(validator.isEmpty(data.name)) {
    errors.name = 'Name is Required';
  }
  if(validator.isEmpty(data.email)) {
    errors.email = 'EMAIL is REQUIRED';
  }
  if(!validator.isEmail(data.email)) {
    errors.email = 'Email is INVALID';
  }
  if(validator.isEmpty(data.password)) {
    errors.password = 'PASSWORD is Required';
  }
  if(!validator.isLength(data.password, { min: 6, max: 30 })){
    errors.password = 'PASSWORD MUST BE BETWEEN 6 AND 30 CHARACTERS';
  }

  if(validator.isEmpty(data.password2)) {
    errors.password2 = 'CONFIRMATION is Required';
  }
  if(!validator.equals(data.password, data.password2)) {
    errors.password2 = 'PASSWORDS MUST MATCH';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
