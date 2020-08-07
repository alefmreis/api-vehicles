const validator = require('fluent-validator');

module.exports = (brand) => validator()
  .validate(brand.name).isNotNullOrUndefined().and.isAlpha()
  .getErrors();
