'use strict';

const knex = require('../knex');

// let searchTerm = 'gaga';
let id = 1001;

knex
  .first('notes.id','title', 'content')
  .from('notes')
  .where('notes.id', id)
  .then(results => {
    console.log(results);
  })
  .catch(err => {
    console.error(err);
  });

  