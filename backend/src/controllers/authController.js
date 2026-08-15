const db = require("../config/db");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    try {
        const { name, email, address, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "invalid email format"
            });
        }

        if (!name || !email || !address || !password) {
            return res.status(400).json({
                message: "all fields are required"
            });
        }

        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({
                message: "name must be between 20 and 60 characters"
            });
        }

        if (address.length > 400) {
            return res.status(400).json({
                message: "address cannot exceed 400 characters"
            });
        }

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "password must be 8-16 characters and contain at least one uppercase letter and one special character"
            });
        }

        const [existingUser] = await db.execute(
            "select id from users where email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            `insert into users (name, email, password, address, role)
             values (?, ?, ?, ?, 'user')`,
            [name, email, hashedPassword, address]
        );

        res.status(201).json({
            message: "user registered successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
    }
};

const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "email and password are required"
            });
        }

        const [users] = await db.execute(
            "select id, name, email, password, address, role from users where email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.jwt_secret,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "current password and new password are required"
            });
        }

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message:
                    "password must be 8-16 characters and contain at least one uppercase letter and one special character"
            });
        }

        const [users] = await db.execute(
            "select password from users where id = ?",
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        const bcrypt = require("bcryptjs");

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            users[0].password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.execute(
            "update users set password = ? where id = ?",
            [hashedPassword, userId]
        );

        res.json({
            message: "password updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
    }
};

module.exports = {
    register,
    login,
    updatePassword
};
