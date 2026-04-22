const router = require("express").Router();
const { updateProfile, searchCustomersByMobile } = require("../controller/user.controller");
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

router.get("/search-mobile/:mobile", authTokenMiddleware, (req, res, next) => {
  const responseBuilder = new responseBuild(res);
  const { mobile } = req.params;

  searchCustomersByMobile(mobile)
    .then((customers) => {
      responseBuilder.setStatus(200);
      responseBuilder.buildResponse({ customers });
    })
    .catch((error) => next(error));
});

module.exports = router;
