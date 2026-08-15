const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
    submitRating,
    updateRating
} = require("../controllers/ratingController");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("user"),
    submitRating
);

router.put(
    "/:store_id",
    authenticate,
    authorize("user"),
    updateRating
);

module.exports = router;