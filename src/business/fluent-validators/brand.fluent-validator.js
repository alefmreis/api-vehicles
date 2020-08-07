module.exports = (brand) => {
  if (typeof brand.name !== 'string') {
    return [{
      validation: 'isString',
      message: 'Required a valid string value',
      value: brand.name,
      param: 'name'
    }];
  }

  return [];
};
