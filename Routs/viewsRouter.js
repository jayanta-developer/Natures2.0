const express = require('express');
const Router = express.Router();
const viewController = require('../Controller/viewsController');

Router.get('/', viewController.overview);
Router.get('/tour', viewController.tour);

module.exports = Router;
