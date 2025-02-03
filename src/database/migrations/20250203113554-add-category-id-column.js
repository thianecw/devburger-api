//RELACIONAMENTOS ENTRE TABELAS//

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    //criando uma coluna category_id dentro da tabela de products >> relacionando com a tabela de categories//
    // e relacionando com o key da tabela categories//
  await queryInterface.addColumn('products', 'category_id', {
type: Sequelize.INTEGER,
references: {
   model: 'categories',
   key: 'id',
},
//toda vez que o campo id tiver uptade, fazer o update lá também: onUpdate: 'cascade'//
//toda vez que o campo id for deletado, lá vai ficar como null//
onUpdate: 'CASCADE',
onDelete: 'SET NULL',
allowNull: true,
  });
  },

  async down (queryInterface, Sequelize) {
await queryInterface.removeColumn('products','category_id');
    }
};
