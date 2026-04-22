const express = require("express");
const router = express.Router();
const {createTeam, getAllTeams,getTeamById,updateTeam,deleteTeam} = require("../controller/team.controller");
const responseBuilder = require("../util/responseBuilder");
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");

router.post("/",authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req,res,next)=>{
    const payload = req.body;
    const builder = new responseBuilder(res);
    createTeam(payload).then((message) => {
        builder.setStatus(201);
        builder.buildResponse({message});
    }).catch((error) => {
        next(error);
    });
});

router.put("/:id",authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req,res,next)=>{
    const { id } = req.params;
    const payload = req.body;
    const builder = new responseBuilder(res);
    updateTeam(id,payload).then((message) => {
        builder.setStatus(200);
        builder.buildResponse({message});
    }).catch((error) => {
        next(error);
    });
});

 router.delete("/:id",authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req,res,next)=> {
    const { id } = req.params;
    const builder = new responseBuilder(res);
    deleteTeam(id).then((message) => {
        builder.setStatus(200);
        builder.buildResponse({message});
    }).catch((error) => {
        next(error);
    });
 });   

 router.get("/",authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req,res,next)=> {
        const query = req.query;
        const builder = new responseBuilder(res);
        getAllTeams(query).then((teams) => {
            builder.setStatus(200);
            builder.buildResponse({data:teams});
        }).catch((error) => {
            next(error);
        });
}); 
router.get("/:id",authTokenMiddleware, accessControl([USER_ROLES.ADMIN]), (req,res,next)=> {
        const { id } = req.params;
        const builder = new responseBuilder(res);
        getTeamById(id).then((team) => {
            builder.setStatus(200);
            builder.buildResponse({data:team});
        }).catch((error) => {
            next(error);
        });
}); 
module.exports = router;