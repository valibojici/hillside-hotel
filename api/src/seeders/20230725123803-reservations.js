'use strict';

const { models } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await models.User.findAll()
    const rooms = await models.Room.findAll();

    await queryInterface.bulkInsert('Reservations', [
      {
        userId: users[0].id,
        roomId: rooms[0].id,
        checkIn: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        total: rooms[0].price * 2,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: users[1].id,
        roomId: rooms[1].id,
        checkIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        checkOut: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        total: rooms[1].price * 2,
        status: 'completed',
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
    await queryInterface.bulkDelete('Reservations', null, {});
  }
};