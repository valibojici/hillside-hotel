'use strict';

const { models } = require('../models');

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
    const roomTypes = (await models.RoomType.findAll()).map(type => type.id);

    await queryInterface.bulkInsert('Rooms', [
      {
        roomNumber: 101,
        roomTypeId: roomTypes[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roomNumber: 201,
        roomTypeId: roomTypes[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roomNumber: 301,
        roomTypeId: roomTypes[1],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roomNumber: 401,
        roomTypeId: roomTypes[1],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roomNumber: 501,
        roomTypeId: roomTypes[2],
        createdAt: new Date(),
        updatedAt: new Date(),
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
    await queryInterface.bulkDelete('Rooms', null, {});
  }
};
