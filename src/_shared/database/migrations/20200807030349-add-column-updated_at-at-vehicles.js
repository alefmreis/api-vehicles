module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'vehicles',
    'updated_at',
    {
      type: Sequelize.DATE,
      allowNull: false
    }
  ),
  down: (queryInterface) => queryInterface.removeColumn('vehicles', 'updated_at')
};
