'use strict';

const bcrypt = require('bcryptjs');

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
        password: await bcrypt.hashSync('12345'),
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user'
      },
      {
        username: 'Jane Doe',
        email: 'jane@gmial.com',
        password: await bcrypt.hashSync('12345'),
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user'
      },
      {
        username: 'valibojici',
        email: 'valibojici@gmail.com',
        password: await bcrypt.hashSync('12345'),
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user'
      },
      {
        username: 'admin',
        email: 'test@test.com',
        password: await bcrypt.hashSync('admin'),
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'admin'
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
