module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'brands',
    'deleted_at',
    {
      type: Sequelize.DATE
    }
  ),

  down: (queryInterface) => queryInterface.removeColumn('brands', 'deleted_at')
};
