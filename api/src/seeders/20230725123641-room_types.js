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
        description: "Discover comfort in the heart of San Francisco. Our Standard Room offers a cozy queen-sized bed, modern amenities, and an en-suite bathroom for a relaxing stay after exploring the city's charms.",
        price: 50 * 100,
        image: 'images/Standard Room.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Deluxe Room',
        description: 'Elevate your stay. The Deluxe Room features a king-sized bed, a spacious interior with a seating area, a lavish en-suite bathroom, and stunning city views. Luxury awaits.',
        price: 125 * 100,
        image: 'images/Deluxe Room.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'King Room',
        description: 'Experience unparalleled luxury. The King Room presents a grand king-sized bed, a separate living area, a deluxe en-suite bathroom, and panoramic views of the iconic San Francisco skyline. Your lavish escape.',
        price: 125 * 100,
        image: 'images/King Room.png',
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
