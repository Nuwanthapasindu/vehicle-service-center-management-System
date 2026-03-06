const express = require("express");
const router = express.Router();
const teamController = require("../controller/team.controller");

router.post("/", teamController.createTeam);
router.get("/filter", teamController.getTeamsBySkill);
router.put("/:id", teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);

module.exports = router;