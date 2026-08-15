
import { useEffect, useState } from "react";
import axios from "axios";
import "./UserDashboard.css";


function UserDashboard() {
    const [stores, setStores] = useState([]);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [ratings, setRatings] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const getStores = async () => {
        if (!token) {
            setMessage("Please login first");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await axios.get(
                "http://localhost:5000/api/stores",
                {
                    headers: {
                        Authorization: `Bearer ${ token } `
                    },
                    params: {
                        name: name.trim(),
                        address: address.trim()
                    }
                }
            );

            setStores(response.data.stores || []);
        } catch (error) {
            console.error("Get stores error:", error);

            setStores([]);

            setMessage(
                error.response?.data?.message ||
                "Failed to load stores"
            );
        } finally {
            setLoading(false);
        }
    };

    const submitRating = async (storeId) => {
        const rating = Number(ratings[storeId]);

        if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            setMessage("Rating must be a whole number between 1 and 5");
            return;
        }

        try {
            setMessage("");

            await axios.post(
                "http://localhost:5000/api/ratings",
                {
                    store_id: storeId,
                    rating: rating
                },
                {
                    headers: {
                        Authorization: `Bearer ${ token } `
                    }
                }
            );

            setMessage("Rating submitted successfully");

            setRatings((previousRatings) => ({
                ...previousRatings,
                [storeId]: ""
            }));

            await getStores();
        } catch (error) {
            console.error("Submit rating error:", error);

            setMessage(
                error.response?.data?.message ||
                "Failed to submit rating"
            );
        }
    };

    const updateRating = async (storeId) => {
        const rating = Number(ratings[storeId]);

        if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            setMessage("Rating must be a whole number between 1 and 5");
            return;
        }

        try {
            setMessage("");

            await axios.put(
                `http://localhost:5000/api/ratings/${storeId}`,
{
    rating: rating
},
{
    headers: {
        Authorization: `Bearer ${token}`
    }
}
            );

setMessage("Rating updated successfully");

setRatings((previousRatings) => ({
    ...previousRatings,
    [storeId]: ""
}));

await getStores();
        } catch (error) {
    console.error("Update rating error:", error);

    setMessage(
        error.response?.data?.message ||
        "Failed to update rating"
    );
}
    };

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    window.location.href = "/";
};

useEffect(() => {
    getStores();
}, []);

return (
    <div className="user-dashboard">

        <header className="user-header">
            <div className="header-left">
                <h1>Roxiler Ratings</h1>
                <p>
                    Find stores and share your experience
                </p>
            </div>

            <button
                className="logout-btn"
                onClick={logout}
            >
                Logout
            </button>
        </header>

        <main className="user-content">

            {message && (
                <div className="user-message">
                    {message}
                </div>
            )}

            <section className="search-card">

                <div className="section-header">
                    <h2>Search Stores</h2>
                    <p>
                        Find a store by name or address
                    </p>
                </div>

                <div className="search-row">

                    <div className="input-group">
                        <label>Store Name</label>

                        <input
                            type="text"
                            placeholder="Enter store name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />
                    </div>

                    <div className="input-group">
                        <label>Address</label>

                        <input
                            type="text"
                            placeholder="Enter address"
                            value={address}
                            onChange={(e) =>
                                setAddress(e.target.value)
                            }
                        />
                    </div>

                    <button
                        className="search-btn"
                        onClick={getStores}
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>

                </div>
            </section>

            <section className="stores-section">

                <div className="section-header">
                    <h2>Stores</h2>
                    <p>
                        View store ratings and submit your rating
                    </p>
                </div>

                <div className="table-card">

                    {loading ? (

                        <div className="loading">
                            Loading stores...
                        </div>

                    ) : stores.length === 0 ? (

                        <div className="no-data">
                            No stores found
                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="stores-table">

                                <thead>
                                    <tr>
                                        <th>Store</th>
                                        <th>Address</th>
                                        <th>Overall Rating</th>
                                        <th>Your Rating</th>
                                        <th>Rating</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {stores.map((store) => {

                                        const hasUserRating =
                                            store.user_rating !== null &&
                                            store.user_rating !== undefined;

                                        return (
                                            <tr key={store.id}>

                                                <td>
                                                    <div className="store-info">

                                                        <div className="store-icon">
                                                            🏪
                                                        </div>

                                                        <div className="store-details">
                                                            <strong>
                                                                {store.name}
                                                            </strong>

                                                            <span>
                                                                Store #{store.id}
                                                            </span>
                                                        </div>

                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="address">
                                                        {store.address}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="overall-rating">
                                                        <span className="star">
                                                            ★
                                                        </span>

                                                        {Number(
                                                            store.overall_rating || 0
                                                        ).toFixed(2)}
                                                    </span>
                                                </td>

                                                <td>
                                                    {hasUserRating ? (
                                                        <span className="your-rating">
                                                            ★ {store.user_rating}
                                                        </span>
                                                    ) : (
                                                        <span className="not-rated">
                                                            Not rated
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    <input
                                                        className="rating-input"
                                                        type="number"
                                                        min="1"
                                                        max="5"
                                                        step="1"
                                                        placeholder="1-5"
                                                        value={
                                                            ratings[store.id] || ""
                                                        }
                                                        onChange={(e) =>
                                                            setRatings({
                                                                ...ratings,
                                                                [store.id]:
                                                                    e.target.value
                                                            })
                                                        }
                                                    />
                                                </td>

                                                <td>
                                                    {hasUserRating ? (
                                                        <button
                                                            className="modify-btn"
                                                            onClick={() =>
                                                                updateRating(
                                                                    store.id
                                                                )
                                                            }
                                                        >
                                                            Modify
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="submit-btn"
                                                            onClick={() =>
                                                                submitRating(
                                                                    store.id
                                                                )
                                                            }
                                                        >
                                                            Submit
                                                        </button>
                                                    )}
                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </section>

        </main>

        <footer className="user-footer">
            Roxiler Ratings Management System
        </footer>

    </div>
);
}

export default UserDashboard;

