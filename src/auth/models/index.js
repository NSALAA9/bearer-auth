'use strict'

const { Sequelize, DataTypes } = require('sequelize')

const dataBase_URL = process.env.NODE_ENV === 'test' ? 'sqlite:memory:' : process.env.DB_URL;

let sequelize = new Sequelize(dataBase_URL, {})

const userTable = require('./users-model')

module.exports = {
    DB: sequelize,
    User: userTable(sequelize, DataTypes)
}