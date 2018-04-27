'use strict';

const knexConfig = require('./knexfile');

const environment = process.env.NODE_ENV || 'development';

console.log(knexConfig[environment]);

module.exports = require('knex')(knexConfig[environment]);
