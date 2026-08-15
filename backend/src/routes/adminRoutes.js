const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
    getDashboard,
    addUser,
    getUsers,
    getUserDetails
} = require("../controllers/adminController");
const {
    addStore,
    getStores
} = require("../controllers/storeController");

const router = express.Router();

router.get(
    "/dashboard",
    authenticate,
    authorize("admin"),
    getDashboard
);

router.post(
    "/stores",
    authenticate,
    authorize("admin"),
    addStore
);

router.post(
    "/users",
    authenticate,
    authorize("admin"),
    addUser
);

router.get(
    "/users",
    authenticate,
    authorize("admin"),
    getUsers
);

router.get(
    "/stores",
    authenticate,
    authorize("admin"),
    getStores
);

router.get(
    "/users/:id",
    authenticate,
    authorize("admin"),
    getUserDetails
);

module.exports = router;