'use strict';
const express = require('express');
//connects express

const knex = require('../knex');
//connects knex

const foldersRouter = express.Router();
//connects express.router

module.exports = foldersRouter;