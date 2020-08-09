const validator = require('fluent-validator');

module.exports = (vehicle) => {
    return validator()
    .validate(vehicle.value).param('value').isNotNullOrUndefined().and.isString()
    .validate(vehicle.model_id).param('model_id').isNotNullOrUndefined().and.isInt()
    .validate(vehicle.year_model).param('year_model').isNotNullOrUndefined().and.isInt()
    .validate(vehicle.fuel).param('fuel').isNotNullOrUndefined().and.isAlpha().and.matches('GASOLINA').or.matches('ETANOL').or.matches('FLEX')
    .getErrors();
};
