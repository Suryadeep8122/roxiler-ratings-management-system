const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { getUserStores } = require("../controllers/storeController");

const router = express.Router();

router.get(
    "/",
    authenticate,
    authorize("user"),
    getUserStores
);

module.exports = router;