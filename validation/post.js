const validator = require('validator');
const isEmpty = require('./is-Empty');

module.exports.validatePostInput = function(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if(!validator.isLength(data.text, { min: 10, max: 1500 })) {
    errors.text = 'POST MUST BE BETWEEN 10 AND 1500 CHARACTERS';
  }

  if(validator.isEmpty(data.text)) {
    errors.text = 'POST IS EMPTY';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports.validateCommentInput = function(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if(!validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = 'COMMENT MUST BE BETWEEN 10 AND 300 CHARACTERS';
  }

  if(validator.isEmpty(data.text)) {
    errors.text = 'COMMENT IS EMPTY';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
