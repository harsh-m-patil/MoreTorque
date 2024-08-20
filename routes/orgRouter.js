const express = require("express");

const orgController = require("../controllers/orgController");

const router = express.Router();

router.post("/", orgController.createOrg);
router.get("/", orgController.getOrgs);
router.get("/:id", orgController.getOrg);

module.exports = router;
