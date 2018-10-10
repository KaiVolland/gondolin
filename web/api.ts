import Generic from '../service/Generic';

import { jwtMiddleWare } from '../service/Authentication';
import db from '../sequelize';
const {
  models
} = db;

const generic = new Generic();

const optionsFromQueryParams = queryParams => {
  const options: any = {};
  const {
    include
  } = queryParams;
  if (include) {
    if (include === "all") {
      options.include = [{ all: true }];
    } else {
      const includeModels = include.split(',');
      options.include = includeModels.map(model => {
        return {
          model: models[model]
        };
      });
    }
  }
  return options;
};

module.exports = app => {

  app.get('/', (req, res) => {
    res.send('gondolin-API running.');
  });

  app.get('/:model/describe', (req, res) => {
    const modelName = req.params.model;
    try {
      const description = generic.getModelDescription(modelName);
      res.send({
        success: true,
        data: description
      });
    } catch (error) {
      res.send({
        success: false,
        error
      });
    }
  });

  app.get('/:model/get', (req, res) => {
    const modelName = req.params.model;
    const options = optionsFromQueryParams(req.query);
    generic.getAllEntities(modelName, options)
      .then(data => res.send({
        success: true,
        data
      }))
      .catch(error => res.send({
        success: false,
        error
      }));
  });

  app.get('/:model/get/:id', (req, res) => {
    const modelName = req.params.model;
    const id = req.params.id;
    const options = optionsFromQueryParams(req.query);
    generic.getEntityById(modelName, id, options)
      .then(data => res.send({
        success: true,
        data
      }))
      .catch(error => res.send({
        success: false,
        error
      }));
  });

  app.post('/:model/create', jwtMiddleWare, (req, res) => {
    const modelName = req.params.model;
    const {
      user,
      body: requestData
    } = req;
    if (!user) {
      res.status(403).json({
        success: false,
        message: 'Couldn\'t get user from request.'
      });
    }
    generic.createEntities(modelName, requestData, user)
      .then(data => res.send({
        success: true,
        data
      }))
      .catch(error => res.send({
        success: false,
        error
      }));
  });

  app.post('/:model/update', jwtMiddleWare, (req, res) => {
    const modelName = req.params.model;
    const {
      user,
      body: requestData
    } = req;
    if (!user) {
      res.status(403).json({
        success: false,
        message: 'Couldn\'t get user from request.'
      });
    }
    generic.updateEntities(modelName, requestData)
      .then(data => res.send({
        success: true,
        data
      }))
      .catch(error => res.send({
        success: false,
        error
      }));
  });

  app.post('/:model/delete', jwtMiddleWare, (req, res) => {
    const modelName = req.params.model;
    const {
      user,
      body: requestData
    } = req;
    if (!user) {
      res.status(403).json({
        success: false,
        message: 'Couldn\'t get user from request.'
      });
    }
    generic.deleteEntities(modelName, requestData)
      .then(data => res.send({
        success: true,
        data
      }))
      .catch(error => res.send({
        success: false,
        error
      }));
  });

};
