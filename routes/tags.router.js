'use strict';

const express = require('express');
//connect express package
const knex = require('../knex');
//connect knex package
const router = express.Router();
//connect express.Router 


router.post('/tags', (req,res,next) => {
  const {name} = req.body;
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = {name};

  knex.insert(newItem)
    .into('tags')
    .returning(['id' ,'name'])
    .then((results) => {
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

module.exports = router;