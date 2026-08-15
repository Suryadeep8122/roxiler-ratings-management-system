const db = require("../config/db");

const submitRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { store_id, rating } = req.body;

        if (!store_id || rating === undefined) {
            return res.status(400).json({
                message: "store_id and rating are required"
            });
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "rating must be between 1 and 5"
            });
        }

        const [stores] = await db.execute(
            "select id from stores where id = ?",
            [store_id]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                message: "store not found"
            });
        }

        const [existingRating] = await db.execute(
            "select id from ratings where user_id = ? and store_id = ?",
            [userId, store_id]
        );

        if (existingRating.length > 0) {
            return res.status(409).json({
                message: "you have already rated this store"
            });
        }

        await db.execute(
            `insert into ratings (user_id, store_id, rating)
             values (?, ?, ?)`,
            [userId, store_id, rating]
        );

        res.status(201).json({
            message: "rating submitted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
    }
};

const updateRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const storeId = req.params.store_id;
        const { rating } = req.body;

        if (rating === undefined) {
            return res.status(400).json({
                message: "rating is required"
            });
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "rating must be between 1 and 5"
            });
        }

        const [existingRating] = await db.execute(
            "select id from ratings where user_id = ? and store_id = ?",
            [userId, storeId]
        );

        if (existingRating.length === 0) {
            return res.status(404).json({
                message: "rating not found"
            });
        }

        await db.execute(
            `update ratings
             set rating = ?
             where user_id = ? and store_id = ?`,
            [rating, userId, storeId]
        );

        res.json({
            message: "rating updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
    }
};

module.exports = {
    submitRating,
    updateRating
};