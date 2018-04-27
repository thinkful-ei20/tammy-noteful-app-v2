'use strict';

const knex = require('../knex');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = function(file, user = 'dev') {
  return exec('psql -f C:/Users/tiant/projects/thinkful/noteful-app-v2/db/noteful.sql -d postgres://dev:dev@localhost/noteful-test');
};