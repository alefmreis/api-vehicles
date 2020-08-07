module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'vehicles',
    'deleted_at',
    {
      type: Sequelize.DATE
    }
  ),

  down: (queryInterface) => queryInterface.removeColumn('vehicles', 'deleted_at')
};
