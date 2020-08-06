module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('vehicles', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false
    },
    brand_id: {
      type: Sequelize.INTEGER,
      references: { model: 'brands', key: 'id' },
      allowNull: false
    },
    model_id: {
      type: Sequelize.INTEGER,
      references: { model: 'models', key: 'id' },
      allowNull: false
    },
    year_model: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    fuel: {
      type: Sequelize.STRING,
      values: ['GASOLINA', 'ETANOL', 'FLEX'],
      defaultValue: 'GASOLINA',
      allowNull: false
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('vehicles')
};
