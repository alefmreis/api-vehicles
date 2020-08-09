const validator = require('fluent-validator');

validator.add('isString', 'Required a valid string value', function (value) { return typeof value === 'string' });

module.exports = (brand) => {
  return validator()
    .validate(brand.name).param('name').isNotNullOrUndefined().and.isString()
    .getErrors();
};
