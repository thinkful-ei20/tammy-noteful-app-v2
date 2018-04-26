'use strict';

const express = require('express');
//connect express package
const knex = require('../knex');
//connect knex package
const router = express.Router();
//connect express.Router 

router.get ('/tags', (req, res, next) => {
  knex.select('id', 'name')
    .from('tags')
    .then((results) => {
      res.json(results);
    })
    .catch(err => next(err));
});
//get all tags ^^^

router.get ('/tags/:id', (req, res, next) => {
  const id = req.params.id;

  knex
    .select('id', 'name')
    .from('tags')
    .where('tags.id', id)
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});
//get all id-specific tag ^^^

router.put('/tags/:id', (req, res, next) => {
  const id = req.params.id;
  const {name} = req.body;

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status(400);
    return next(err);
  }

  const newName = {name};

  knex('tags')
    .update(newName)
    .where('id', id)
    .returning(['id', 'name'])
    .then(([result]) => {
      if (result) {
        res.json(result);
      } else {
        next ();
      }
    })
    .catch(err => next(err));
});


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