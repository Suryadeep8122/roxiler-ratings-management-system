const db = require("../config/db");

const addStore = async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;

        if (!name || !email || !address || !owner_id) {
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

        const [owners] = await db.execute(
            "select id, role from users where id = ?",
            [owner_id]
        );

        if (owners.length === 0) {
            return res.status(404).json({
                message: "store owner not found"
            });
        }

        if (owners[0].role !== "store_owner") {
            return res.status(400).json({
                message: "selected user is not a store owner"
            });
        }

        const [existingStore] = await db.execute(
            "select id from stores where email = ?",
            [email]
        );

        if (existingStore.length > 0) {
            return res.status(409).json({
                message: "store email already exists"
            });
        }

        await db.execute(
            `insert into stores (name, email, address, owner_id)
             values (?, ?, ?, ?)`,
            [name, email, address, owner_id]
        );

        res.status(201).json({
            message: "store added successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
    }
};

const getStores = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            sortBy,
            sortOrder
        } = req.query;

        let query = `
            select
                s.id,
                s.name,
                s.email,
                s.address,
                coalesce(avg(r.rating), 0) as rating
            from stores s
            left join ratings r on s.id = r.store_id
        `;

        const params = [];
        const conditions = [];

        if (name) {
            conditions.push("s.name like ?");
            params.push(`%${name}%`);
        }

        if (email) {
            conditions.push("s.email like ?");
            params.push(`%${email}%`);
        }

        if (address) {
            conditions.push("s.address like ?");
            params.push(`%${address}%`);
        }

        if (conditions.length > 0) {
            query += " where " + conditions.join(" and ");
        }

        query += `
            group by
                s.id,
                s.name,
                s.email,
                s.address
        `;

        const allowedSortFields = {
            name: "s.name",
            email: "s.email",
            address: "s.address",
            rating: "rating"
        };

        const sortField = allowedSortFields[sortBy] || "s.name";
        const order = sortOrder === "desc" ? "desc" : "asc";

        query += ` order by ${sortField} ${order}`;

        const [stores] = await db.execute(query, params);

        res.json({
            stores
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
    }
};

const getUserStores = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, address, sortBy, sortOrder } = req.query;

        let query = `
            select
                s.id,
                s.name,
                s.address,
                coalesce(avg(all_ratings.rating), 0) as overall_rating,
                user_rating.rating as user_rating
            from stores s
            left join ratings all_ratings
                on s.id = all_ratings.store_id
            left join ratings user_rating
                on s.id = user_rating.store_id
                and user_rating.user_id = ?
        `;

        const params = [userId];
        const conditions = [];

        if (name) {
            conditions.push("s.name like ?");
            params.push(`%${name}%`);
        }

        if (address) {
            conditions.push("s.address like ?");
            params.push(`%${address}%`);
        }

        if (conditions.length > 0) {
            query += " where " + conditions.join(" and ");
        }

        query += `
    group by
        s.id,
        s.name,
        s.address,
        user_rating.rating
`;
        const allowedSortFields = {
            name: "s.name",
            address: "s.address",
            rating: "overall_rating"
        };

        const sortField = allowedSortFields[sortBy] || "s.name";
        const order = sortOrder === "desc" ? "desc" : "asc";

        query += ` order by ${sortField} ${order}`;

        const [stores] = await db.execute(query, params);

        res.json({
            stores
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
    }
};
module.exports = {
    addStore,
    getStores,
    getUserStores
};