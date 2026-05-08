const router = require("express").Router();
const {
  createGalleryImage,
  getAllGalleryImages,
  deleteGalleryImage,
} = require("../controller/gallery.controller");
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");
const responseBuild = require("../util/responseBuilder");

router.post(
  "/",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    createGalleryImage(req.body)
      .then((data) => {
        responseBuilder.setStatus(201);
        responseBuilder.buildResponse(data);
      })
      .catch((error) => next(error));
  }
);

router.get("/", (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  getAllGalleryImages()
    .then((data) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse(data);
    })
    .catch((error) => next(error));
});

router.delete(
  "/:id",
  authTokenMiddleware,
  accessControl([USER_ROLES.ADMIN]),
  (req, res, next) => {
    const responseBuilder = new responseBuild(res);
    deleteGalleryImage(req.params.id)
      .then((data) => {
        responseBuilder.setStatus(200);
        responseBuilder.buildResponse(data);
      })
      .catch((error) => next(error));
  }
);

module.exports = router;
