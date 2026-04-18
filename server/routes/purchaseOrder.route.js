const router = require('express').Router();
const {
  createPurchaseOrder,
  getAllPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder,
} = require('../controller/purchaseOrder.controller');
const responseBuild = require('../util/responseBuilder');
const { authTokenMiddleware } = require('../middleware/auth');

router.use(authTokenMiddleware);

router.post('/', (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;

  createPurchaseOrder(payload)
    .then((order) => {
      responseBuilder.setStatus(201);
      responseBuilder.buildResponse({ order });
    })
    .catch((error) => next(error));
});

router.get('/', (req, res, next) => {
  const responseBuilder = new responseBuild(res);

  getAllPurchaseOrders()
    .then((orders) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ orders });
    })
    .catch((error) => next(error));
});

router.put('/:id', (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;
  const { id } = req.params;

  updatePurchaseOrder(id, payload)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

router.delete('/:id', (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const { id } = req.params;

  deletePurchaseOrder(id)
    .then((message) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message });
    })
    .catch((error) => next(error));
});

module.exports = router;
