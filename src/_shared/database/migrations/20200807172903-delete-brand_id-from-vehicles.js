module.exports = {
  up: (queryInterface) => queryInterface.removeColumn(
    'vehicles',
    'brand_id'
  ),

  down: (queryInterface, Sequelize) => queryInterface.addColumn('vehicles', 'brand_id', {
    type: Sequelize.INTEGER,
    references: { model: 'brands', key: 'id' },
    allowNull: false
  })
};
