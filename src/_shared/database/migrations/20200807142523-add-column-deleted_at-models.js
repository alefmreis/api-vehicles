module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'models',
    'deleted_at',
    {
      type: Sequelize.DATE
    }
  ),

  down: (queryInterface) => queryInterface.removeColumn('models', 'deleted_at')
};
