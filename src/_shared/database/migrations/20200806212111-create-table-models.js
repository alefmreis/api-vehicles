module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('models', {
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
    },
    brand_id: {
      type: Sequelize.INTEGER,
      references: { model: 'brands', key: 'id' },
      allowNull: false
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('models')
};