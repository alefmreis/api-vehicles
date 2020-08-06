module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('brands', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('brands')
};
