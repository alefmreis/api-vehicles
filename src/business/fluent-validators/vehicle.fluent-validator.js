const validator = require('fluent-validator');

module.exports = (vehicle) => {
  if (typeof vehicle.value !== 'string') {
    return [{
      validation: 'isString',
      message: 'Required a valid string value',
      value: vehicle.value,
      param: 'value'
    }];
  }

  return validator()
    .validate(vehicle.brand_id).param('brand_id').isNotNullOrUndefined().and.isInt()
    .validate(vehicle.model_id).param('model_id').isNotNullOrUndefined().and.isInt()
    .validate(vehicle.year_model).param('year_model').isNotNullOrUndefined().and.isInt()
    .validate(vehicle.fuel).param('fuel').isNotNullOrUndefined().and.isAlpha().and.matches('GASOLINA').or.matches('ETANOL').or.matches('FLEX')
    .getErrors();
};
