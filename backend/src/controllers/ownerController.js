const db = require("../config/db");

const getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const [stores] = await db.execute(
            `select id, name, email, address
             from stores
             where owner_id = ?
             order by id`,
            [ownerId]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                message: "store not found"
            });
        }

        const storeDetails = [];

        for (const store of stores) {

            const [ratingResult] = await db.execute(
                `select coalesce(avg(rating), 0) as average_rating
                 from ratings
                 where store_id = ?`,
                [store.id]
            );

            const [users] = await db.execute(
                `select
                    u.id,
                    u.name,
                    u.email,
                    r.rating,
                    r.created_at
                 from ratings r
                 join users u on r.user_id = u.id
                 where r.store_id = ?
                 order by r.created_at desc`,
                [store.id]
            );

            storeDetails.push({
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                average_rating: ratingResult[0].average_rating,
                users: users
            });
        }

        res.json({
            stores: storeDetails
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
    }
};

module.exports = {
    getOwnerDashboard
};