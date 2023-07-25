'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     * 
     * 
    */
    await queryInterface.bulkInsert('Users', [
      {
        username: 'John Doe',
        email: 'john@gmial.com',
        password: 'q'.repeat(60),
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user'
      },
      {
        username: 'Jane Doe',
        email: 'jane@gmial.com',
        password: 'w'.repeat(60),
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user'
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
