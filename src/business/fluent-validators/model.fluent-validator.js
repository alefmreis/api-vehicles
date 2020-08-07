const validator = require('fluent-validator');

module.exports = (model) => {
  if (typeof model.name !== 'string') {
    return [{
      validation: 'isString',
      message: 'Required a valid string value',
      value: model.name,
      param: 'name'
    }];
  }

  return validator()
    .validate(model.brand_id).param('brand_id').isNotNullOrUndefined().and.isInt()
    .getErrors();
};
