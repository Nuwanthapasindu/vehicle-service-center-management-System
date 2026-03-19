const router = require("express").Router();
const { updateProfile } = require("../controller/user.controller");
const { authTokenMiddleware } = require("../middleware/auth");
const responseBuild = require("../util/responseBuilder");

router.put("/profile", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const payload = req.body;
  const mobile = req.user.mobile; 

  updateProfile(payload, mobile)
    .then((user) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ message: "Profile updated successfully", user });
    })
    .catch((error) => next(error));
});

module.exports = router;
