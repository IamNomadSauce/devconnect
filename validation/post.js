const validator = require('validator');
const isEmpty = require('./is-Empty');
module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if(!validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = 'TEXT is REQUIRED';
  }

  if(validator.isEmpty(data.text)) {
    errors.text = 'TEXT is REQUIRED';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
