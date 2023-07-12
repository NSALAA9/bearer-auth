'use strict'

const { Sequelize, DataTypes } = require('sequelize')

const dataBase_URL = process.env.DATABASE_URL;

let sequelize = new Sequelize(dataBase_URL, {})

const userTable = require('./users-model')

module.exports = {
    DB: sequelize,
    User: userTable(sequelize, DataTypes)
}
