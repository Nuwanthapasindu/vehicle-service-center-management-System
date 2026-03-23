const express = require("express");
const router = express.Router();
const teamController = require("../controller/team.controller");

router.post("/", teamController.createTeam);
router.get("/filter", teamController.getTeamsBySkill);
router.put("/:id", teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);
router.get("/", teamController.getAllTeams);
router.get("/:id", teamController.getTeamById);

module.exports = router;