const validator = require('fluent-validator');

module.exports = (model) => {
  return validator()
    .validate(model.name).param('name').isNotNullOrUndefined().and.isString()
    .validate(model.brand_id).param('brand_id').isNotNullOrUndefined().and.isInt()
    .getErrors();
};
