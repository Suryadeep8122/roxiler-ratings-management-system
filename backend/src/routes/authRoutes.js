const express = require("express");
const {
    register,
    login,
    updatePassword
} = require("../controllers/authController");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.put(
    "/password",
    authenticate,
    updatePassword
);

module.exports = router;