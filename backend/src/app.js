const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ownerRoutes = require("./routes/ownerRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/owner", ownerRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "roxiler rating api is running"
    });
});

const port = 5000;

app.listen(port, async () => {
    console.log(`server running on port ${port}`);

    try {
        const connection = await db.getConnection();
        console.log("mysql connected successfully");
        connection.release();
    } catch (error) {
        console.error("mysql connection failed:", error.message);
    }
});
