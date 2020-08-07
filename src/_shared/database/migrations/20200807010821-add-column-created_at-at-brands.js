module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'brands',
    'created_at',
    {
      type: Sequelize.DATE,
      allowNull: false
    }
  ),

  down: (queryInterface) => queryInterface.removeColumn('brands', 'created_at')
};
