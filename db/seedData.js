'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = function(file) {
  return exec(`psql -f ${file} -d postgres://postgres:@localhost/noteful-test`);
};