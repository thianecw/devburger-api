/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adiciona a coluna 'sale' com allowNull: true temporariamente
    await queryInterface.addColumn('products', 'sale', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true,  // Permite valores nulos para evitar o erro nas linhas existentes
    });

    // Atualiza os registros existentes com o valor 'false' para a coluna 'sale'
    await queryInterface.sequelize.query(
      `UPDATE "products" SET "sale" = false WHERE "sale" IS NULL`
    );

    // Agora, altera a coluna para não permitir nulos
    await queryInterface.changeColumn('products', 'sale', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'sale');
  }
};
