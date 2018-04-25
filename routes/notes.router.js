'use strict';

const express = require('express');
const knex = require('../knex');
// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
// const data = require('../db/notes');
// const simDB = require('../db/simDB');
// const notes = simDB.initialize(data);




// Get All (and search by query)
router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  const folderId = req.params.folderId;

  knex.select('notes.id', 'title', 'content', 'folders.id as folder_id', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders','notes.folder_id', 'folders.id')
    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function (queryBuilder){
      if (folderId){
        queryBuilder.where('folder_id', folderId);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});
// Get a single item
router.get('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  knex
    .first('notes.id','title', 'content', 'folders.id as folder_id', 'folders.name as folderName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .where('notes.id', id)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    });
});

// Put update an item
router.put('/notes/:id', (req, res, next) => {
  const noteId = req.params.id;
  const { title, content, folder_id } = req.body;

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const updateItem = {
    title: title,
    content: content,
    folder_id: folder_id
  };

  knex('notes')
    .update(updateItem)
    .where('id', noteId)
    .returning(['id', 'title', 'content'])
    .then(([result]) => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

// Post (insert) an item
router.post('/notes', (req, res, next) => {
  const { title, content, folder_id } = req.body;

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = {
    title: title,
    content: content,
    folder_id: folder_id
  };
  

  knex.insert(newItem)
    .into('notes')
    .returning('id')
    .then(([id]) => {
      let noteId = id;
      //^ assigns new id
      return knex.select('notes.id', 'title', 'folder_id', 'folders.name as folder_name')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', noteId);
    })
    .then(([result]) =>{
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

// Delete an item
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  knex.del()
    .where('id', req.params.id)
    .from('notes')
    .then(() => {
      res.status(204).end();
    })
    .catch(err => next(err));
});

module.exports = router;
