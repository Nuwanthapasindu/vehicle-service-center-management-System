const express = require("express");

const router = express.Router();
const {createEmployee,getEmployees,updateEmployee,toggleAvailability,deleteEmployee} = require("../controller/employee.controller");
const responseBuilder = require("../util/responseBuilder");
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");

//create employee
router.post("/",authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req,res,next)=>{
    const payload = req.body;
    const builder = new responseBuilder(res);
    createEmployee(payload).then((message) => {
        builder.setStatus(201);
        builder.buildResponse({message});
    }).catch((error) => {
        next(error);
    });
});

//get employeelist
router.get("/",authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req,res,next)=>{
    const query = req.query;
    const builder = new responseBuilder(res);
    getEmployees(query).then((employees) => {
        builder.setStatus(200);
        builder.buildResponse({data:employees});
    }).catch((error) => {
        next(error);
    });
}); 

//update employee
router.put("/:id",authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req,res,next)=>{
     const { id } = req.params;
    const payload = req.body;
    const builder = new responseBuilder(res);
    updateEmployee(id,payload).then((message) => {
        builder.setStatus(200);
        builder.buildResponse({message});
    }).catch((error) => {
        next(error);
    });
});

//toggle availability - update only availability field of employee
router.patch("/availability/:id", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
    const { id } = req.params;
    const builder = new responseBuilder(res);
    toggleAvailability(id).then((message) => {
        builder.setStatus(200);
        builder.buildResponse({message});
    }).catch((error) => {
        next(error);
    });
});

// Removed deactivate route and added delete route
router.delete("/:id", authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req, res, next) => {
    const { id } = req.params;
    const builder = new responseBuilder(res);
    deleteEmployee(id).then((message) => {
        builder.setStatus(200);
        builder.buildResponse({message});
    }).catch((error) => {
        next(error);
    });
});

module.exports = router;