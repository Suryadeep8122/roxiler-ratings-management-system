const authorize = require("../middleware/roleMiddleware");
const express = require("express");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authenticate, (req, res) => {
    res.json({
        message: "authentication successful",
        user: req.user
    });
});
router.get("/admin-test", authenticate, authorize("admin"), (req, res) => {
    res.json({
        message: "welcome admin",
        user: req.user
    });
});

module.exports = router;