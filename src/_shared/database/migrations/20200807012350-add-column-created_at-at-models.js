module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'models',
    'created_at',
    {
      type: Sequelize.DATE,
      allowNull: false
    }
  ),

  down: (queryInterface) => queryInterface.removeColumn('models', 'created_at')
};
