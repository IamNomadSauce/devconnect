const validator = require('validator');
const isEmpty = require('./is-Empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if(validator.isEmpty(data.title)) {
    errors.title = 'JOB-TITLE is REQUIRED';
  }
  if(validator.isEmpty(data.company)) {
    errors.company = 'COMPANY is REQUIRED';
  }
  if(validator.isEmpty(data.from)) {
    errors.from = 'FROM-DATE is REQUIRED';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
