const express = require("express");
const router = express.Router();
const employeeController = require("../controller/employee.controller");

router.post("/", employeeController.createEmployee);
router.get("/", employeeController.getEmployees);
router.put("/:id", employeeController.updateEmployee);
router.patch("/availability/:id", employeeController.toggleAvailability);
// Removed deactivate route and added delete route
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;