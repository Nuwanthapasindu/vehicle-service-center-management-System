const express = require("express");
const router = express.Router();
const {createTeam, getAllTeams,getTeamById,updateTeam,deleteTeam} = require("../controller/team.controller");
const responseBuilder = require("../util/responseBuilder");
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");

/**
 * @swagger
 * /api/v1/teams:
 *   post:
 *     summary: Create a team
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Team created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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

/**
 * @swagger
 * /api/v1/teams/{id}:
 *   put:
 *     summary: Update a team
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Team updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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

/**
 * @swagger
 * /api/v1/teams/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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

/**
 * @swagger
 * /api/v1/teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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
/**
 * @swagger
 * /api/v1/teams/{id}:
 *   get:
 *     summary: Get a team by ID
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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