/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.removeColumn('products', 'category') //remover a coluna category dentro da tabela de products//
    },

  async down (queryInterface, Sequelize) {
   await queryInterface.addColumn('products', 'category', {
          type: Sequelize.STRING,
      allowNull: true,
       })
  }
};
