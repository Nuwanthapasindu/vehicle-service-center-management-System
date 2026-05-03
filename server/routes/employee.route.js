const express = require("express");

const router = express.Router();
const {createEmployee,getEmployees,updateEmployee,toggleAvailability,deleteEmployee} = require("../controller/employee.controller");
const responseBuilder = require("../util/responseBuilder");
const { authTokenMiddleware, accessControl } = require("../middleware/auth");
const { USER_ROLES } = require("../util/constants");

/**
 * @swagger
 * /api/v1/employees:
 *   post:
 *     summary: Create an employee
 *     tags: [Employee]
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
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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

/**
 * @swagger
 * /api/v1/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Employee list retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   put:
 *     summary: Update an employee
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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

/**
 * @swagger
 * /api/v1/employees/availability/{id}:
 *   patch:
 *     summary: Toggle employee availability
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee availability toggled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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