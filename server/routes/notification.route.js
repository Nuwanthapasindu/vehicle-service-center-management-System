const router = require("express").Router();
const responseBuild = require("../util/responseBuilder");
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} = require("../controller/notification.controller");

router.get(
  "/",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    getNotifications(req.user.mobile)
      .then((data) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse(data);
      })
      .catch((error) => next(error));
  }
);

router.get(
  "/unread-count",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    getUnreadCount(req.user.mobile)
      .then((data) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse(data);
      })
      .catch((error) => next(error));
  }
);

router.patch(
  "/read-all",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    markAllAsRead(req.user.mobile)
      .then((data) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse(data);
      })
      .catch((error) => next(error));
  }
);

router.patch(
  "/:id/read",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    markAsRead(req.params.id, req.user.mobile)
      .then((data) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse(data);
      })
      .catch((error) => next(error));
  }
);

module.exports = router;
