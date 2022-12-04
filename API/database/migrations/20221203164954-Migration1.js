'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE usuarios (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL,
        token VARCHAR(50)
      );
    `)
    await queryInterface.sequelize.query(`
    CREATE TABLE companias (
      id SERIAL PRIMARY KEY,
      companyName VARCHAR(50) NOT NULL,
      companyApiKey VARCHAR(50) NOT NULL
    );`
    )
    await queryInterface.sequelize.query(`
    CREATE TABLE ubicaciones (
      id SERIAL PRIMARY KEY,
      companyId SERIAL NOT NULL REFERENCES companias(id),
      locationName VARCHAR(50),
      locationCountry VARCHAR(50),
      locationCity VARCHAR(50),
      locationMeta VARCHAR(50)
    );`
    )
    await queryInterface.sequelize.query(`
    CREATE TABLE sensores (
      id SERIAL PRIMARY KEY,
      locationId SERIAL NOT NULL REFERENCES ubicaciones(id),
      sensorName VARCHAR(50) NOT NULL,
      sensorCategory VARCHAR(50),
      sensorMeta VARCHAR(50),
      sensorApiKey VARCHAR(50) NOT NULL
    );`)
    await queryInterface.sequelize.query(`
    CREATE TABLE datos (
      id SERIAL PRIMARY KEY,
      sensorId SERIAL NOT NULL REFERENCES sensores(id),
      dataValue VARCHAR(50) NOT NULL,
      dataValue2 VARCHAR(50) NOT NULL,
      dataDate timestamptz NOT NULL
    );`)

  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE datos;
    `)
    await queryInterface.sequelize.query(`
      DROP TABLE sensores;
    `)
    await queryInterface.sequelize.query(`
      DROP TABLE ubicaciones;
      `)
    await queryInterface.sequelize.query(`
        DROP TABLE companias;
      `)
    await queryInterface.sequelize.query(`
      DROP TABLE usuarios;
    `)
  }
};
