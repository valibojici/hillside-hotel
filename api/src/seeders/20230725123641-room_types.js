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
    await queryInterface.bulkInsert('RoomTypes', [
      {
        name: 'Standard Room',
        description: 'This is a standard description.',
        price: 50 * 100,
        image: 'images/room.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Deluxe Room',
        description: 'This is a deluxe description.',
        price: 125 * 100,
        image: 'images/room.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('RoomTypes', null, {});
  }
};
