module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'models',
    'updated_at',
    {
      type: Sequelize.DATE,
      allowNull: false
    }
  ),

  down: (queryInterface) => queryInterface.removeColumn('models', 'updated_at')
};
