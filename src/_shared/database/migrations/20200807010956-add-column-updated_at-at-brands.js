module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'brands',
    'updated_at',
    {
      type: Sequelize.DATE,
      allowNull: false
    }
  ),

  down: (queryInterface) => queryInterface.removeColumn('brands', 'updated_at')
};
