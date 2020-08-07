module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'vehicles',
    'created_at',
    {
      type: Sequelize.DATE,
      allowNull: false
    }
  ),
  down: (queryInterface) => queryInterface.removeColumn('vehicles', 'created_at')
};
