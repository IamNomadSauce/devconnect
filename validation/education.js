const validator = require('validator');
const isEmpty = require('./is-Empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if(validator.isEmpty(data.school)) {
    errors.school = 'SCHOOL is REQUIRED';
  }
  if(validator.isEmpty(data.degree)) {
    errors.degree = 'DEGREE is REQUIRED';
  }
  if(validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'FIELD OF STUDY is REQUIRED';
  }
  if(validator.isEmpty(data.from)) {
    errors.from = 'FROM-DATE is REQUIRED';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
