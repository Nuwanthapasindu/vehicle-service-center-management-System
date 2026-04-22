const router = require('express').Router();
const {
  createSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
} = require('../controller/supplier.controller');
const responseBuild = require('../util/responseBuilder');
const { authTokenMiddleware, accessControl } = require('../middleware/auth');
const { USER_ROLES } = require('../util/constants');

router.use(authTokenMiddleware, accessControl([USER_ROLES.ADMIN]));

router.post('/', (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;

  createSupplier(payload)
    .then((supplier) => {
      responseBuilder.setStatus(201);
      responseBuilder.buildResponse({ supplier });
    })
    .catch((error) => next(error));
});

router.get('/', (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  getAllSuppliers()
    .then((suppliers) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ suppliers });
    })
    .catch((error) => next(error));
});

router.put('/:id', (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;
  const { id } = req.params;

  updateSupplier(id, payload)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

router.delete('/:id', (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const { id } = req.params;

  deleteSupplier(id)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

module.exports = router;