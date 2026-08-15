
import { useEffect, useState } from "react";
import axios from "axios";
import "./OwnerDashboard.css";

function OwnerDashboard() {
    const [stores, setStores] = useState([]);
    const [message, setMessage] = useState("");

    const getOwnerDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/owner/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${ token } `
                    }
                }
            );

            console.log(
                "owner dashboard response:",
                response.data
            );

            if (Array.isArray(response.data.stores)) {
                setStores(response.data.stores);
            } else {
                setStores([]);
            }

            setMessage("");

        } catch (error) {
            console.error(
                "owner dashboard error:",
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.message ||
                "failed to load owner dashboard"
            );

            setStores([]);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");

        window.location.href = "/";
    };

    useEffect(() => {
        getOwnerDashboard();
    }, []);

    return (
        <div className="owner-dashboard">

            <header className="owner-header">

                <div>
                    <h1>Roxiler Ratings</h1>
                    <p>Store Owner Dashboard</p>
                </div>

                <button
                    className="owner-logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </header>

            <main className="owner-content">

                {message && (
                    <div className="owner-message">
                        {message}
                    </div>
                )}

                <section className="owner-title-section">
                    <h2>My Stores</h2>
                    <p>
                        View your stores, ratings and customers
                    </p>
                </section>

                {stores.length === 0 ? (

                    <div className="owner-empty">
                        <div className="empty-icon">🏪</div>

                        <h3>No stores found</h3>

                        <p>
                            There are currently no stores associated
                            with your account.
                        </p>
                    </div>

                ) : (

                    <div className="owner-stores">

                        {stores.map((store) => {

                            const storeUsers = Array.isArray(store.users)
                                ? store.users
                                : [];

                            return (
                                <section
                                    className="owner-store-card"
                                    key={store.id}
                                >

                                    <div className="store-card-header">

                                        <div className="store-title">

                                            <div className="owner-store-icon">
                                                🏪
                                            </div>

                                            <div>
                                                <h2>
                                                    {store.name}
                                                </h2>

                                                <span>
                                                    Store #{store.id}
                                                </span>
                                            </div>

                                        </div>

                                        <div className="rating-summary">

                                            <span className="rating-star">
                                                ★
                                            </span>

                                            <strong>
                                                {Number(
                                                    store.average_rating || 0
                                                ).toFixed(2)}
                                            </strong>

                                            <span>
                                                Average Rating
                                            </span>

                                        </div>

                                    </div>

                                    <div className="store-information">

                                        <div className="info-item">

                                            <span className="info-label">
                                                Email
                                            </span>

                                            <span className="info-value">
                                                {store.email}
                                            </span>

                                        </div>

                                        <div className="info-item">

                                            <span className="info-label">
                                                Address
                                            </span>

                                            <span className="info-value">
                                                {store.address}
                                            </span>

                                        </div>

                                        <div className="info-item">

                                            <span className="info-label">
                                                Customers Rated
                                            </span>

                                            <span className="info-value">
                                                {storeUsers.length}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="ratings-section">

                                        <div className="ratings-header">

                                            <div>
                                                <h3>
                                                    Users Who Rated This Store
                                                </h3>

                                                <p>
                                                    Customer ratings and activity
                                                </p>
                                            </div>

                                            <span className="rating-count">
                                                {storeUsers.length} rating
                                                {storeUsers.length !== 1
                                                    ? "s"
                                                    : ""}
                                            </span>

                                        </div>

                                        {storeUsers.length === 0 ? (

                                            <div className="no-ratings">
                                                <span>⭐</span>

                                                <p>
                                                    No users have rated this
                                                    store yet.
                                                </p>
                                            </div>

                                        ) : (

                                            <div className="ratings-table-wrapper">

                                                <table className="ratings-table">

                                                    <thead>

                                                        <tr>
                                                            <th>User ID</th>
                                                            <th>Name</th>
                                                            <th>Email</th>
                                                            <th>Rating</th>
                                                            <th>Date</th>
                                                        </tr>

                                                    </thead>

                                                    <tbody>

                                                        {storeUsers.map(
                                                            (user) => (
                                                                <tr
                                                                    key={
                                                                        user.id +
                                                                        "-" +
                                                                        user.created_at
                                                                    }
                                                                >

                                                                    <td>
                                                                        <span className="user-id">
                                                                            #{user.id}
                                                                        </span>
                                                                    </td>

                                                                    <td>
                                                                        <strong>
                                                                            {user.name}
                                                                        </strong>
                                                                    </td>

                                                                    <td>
                                                                        <span className="user-email">
                                                                            {user.email}
                                                                        </span>
                                                                    </td>

                                                                    <td>

                                                                        <span className="user-rating">

                                                                            <span>
                                                                                ★
                                                                            </span>

                                                                            {user.rating}

                                                                        </span>

                                                                    </td>

                                                                    <td>
                                                                        {new Date(
                                                                            user.created_at
                                                                        ).toLocaleString()}
                                                                    </td>

                                                                </tr>
                                                            )
                                                        )}

                                                    </tbody>

                                                </table>

                                            </div>

                                        )}

                                    </div>

                                </section>
                            );
                        })}

                    </div>
                )}

            </main>

            <footer className="owner-footer">
                Roxiler Ratings Management System
            </footer>

        </div>
    );
}

export default OwnerDashboard;

