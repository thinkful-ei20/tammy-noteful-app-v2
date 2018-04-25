'use strict';
const express = require('express');
//connects express

const knex = require('../knex');
//connects knex

const router = express.Router();
//connects express.router

router.get('/folders', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/folders/:folderId', (req, res, next) => {
  const folderId = req.params.folderId;
  knex
    .first('id', 'name')
    .from('folders')
    .where('folders.id', folderId)
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});


router.put('/folders/:folderId', (req, res, next) => {
  const folderId = req.params.folderId;
  const name = req.body.name;

  if (!name) {
    const err = new Error ('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const updateFolder = {
    name: name,
  };

  knex('folders')
    .update(updateFolder)
    .where('id', folderId)
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

router.post('/folders', (req, res, next) => {
  const name = req.body.name;

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = {
    name:name,
  };

  knex.insert(newItem)
    .into('folders')
    .returning(['id', 'name'])
    .then((results) => {
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

router.delete('/folders/:id', (req, res, next) => {
  knex.del()
    .where('id', req.params.id)
    .from('folders')
    .then(() => {
      res.status(204).end();
    })
    .catch(err => next(err));
});

module.exports = router;