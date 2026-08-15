const db = require("../config/db");

const getDashboard = async (req, res) => {
    try {
        const [userCount] = await db.execute(
            "select count(*) as total_users from users"
        );

        const [storeCount] = await db.execute(
            "select count(*) as total_stores from stores"
        );

        const [ratingCount] = await db.execute(
            "select count(*) as total_ratings from ratings"
        );

        res.json({
            total_users: userCount[0].total_users,
            total_stores: storeCount[0].total_stores,
            total_ratings: ratingCount[0].total_ratings
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
    }
};

const addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "invalid email format"
            });
        }

        if (!name || !email || !password || !address || !role) {
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

        const allowedRoles = ["user", "admin", "store_owner"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "invalid role"
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

        const bcrypt = require("bcryptjs");

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            `insert into users
            (name, email, password, address, role)
            values (?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, address, role]
        );

        res.status(201).json({
            message: "user added successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            role,
            sortBy,
            sortOrder
        } = req.query;

        let query = `
            select id, name, email, address, role
            from users
            where role in ('user', 'admin')
        `;

        const params = [];
        const conditions = [];

        if (name) {
            conditions.push("name like ?");
            params.push(`%${name}%`);
        }

        if (email) {
            conditions.push("email like ?");
            params.push(`%${email}%`);
        }

        if (address) {
            conditions.push("address like ?");
            params.push(`%${address}%`);
        }

        if (role && ["user", "admin"].includes(role)) {
            conditions.push("role = ?");
            params.push(role);
        }

        if (conditions.length > 0) {
            query += " and " + conditions.join(" and ");
        }

        const allowedSortFields = {
            name: "name",
            email: "email",
            address: "address",
            role: "role"
        };

        const sortField = allowedSortFields[sortBy] || "name";
        const order = sortOrder === "desc" ? "desc" : "asc";

        query += ` order by ${sortField} ${order}`;

        const [users] = await db.execute(query, params);

        res.json({
            users
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;

        const [users] = await db.execute(
            `select id, name, email, address, role
             from users
             where id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        const user = users[0];

        let rating = null;

        if (user.role === "store_owner") {
            const [ratings] = await db.execute(
                `select coalesce(avg(r.rating), 0) as rating
                 from stores s
                 left join ratings r on s.id = r.store_id
                 where s.owner_id = ?`,
                [userId]
            );

            rating = ratings[0].rating;
        }

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role,
                rating: rating
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
    }
};

module.exports = {
    getDashboard,
    addUser,
    getUsers,
    getUserDetails
};