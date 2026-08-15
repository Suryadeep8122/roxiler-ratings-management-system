import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [dashboard, setDashboard] = useState({});
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [userRole, setUserRole] = useState("");
    const [userSortBy, setUserSortBy] = useState("name");
    const [userSortOrder, setUserSortOrder] = useState("asc");

    const [storeName, setStoreName] = useState("");
    const [storeEmail, setStoreEmail] = useState("");
    const [storeAddress, setStoreAddress] = useState("");
    const [storeSortBy, setStoreSortBy] = useState("name");
    const [storeSortOrder, setStoreSortOrder] = useState("asc");

    const [selectedUser, setSelectedUser] = useState(null);

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user"
    });

    const [newStore, setNewStore] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const getDashboard = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/admin/dashboard",
                config
            );

            setDashboard(response.data);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "failed to load dashboard"
            );
        }
    };

    const getUsers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/admin/users",
                {
                    ...config,
                    params: {
                        name: userName,
                        email: userEmail,
                        address: userAddress,
                        role: userRole,
                        sortBy: userSortBy,
                        sortOrder: userSortOrder
                    }
                }
            );

            setUsers(response.data.users);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "failed to load users"
            );
        }
    };

    const getStores = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/admin/stores",
                {
                    ...config,
                    params: {
                        name: storeName,
                        email: storeEmail,
                        address: storeAddress,
                        sortBy: storeSortBy,
                        sortOrder: storeSortOrder
                    }
                }
            );

            setStores(response.data.stores);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "failed to load stores"
            );
        }
    };

    const getUserDetails = async (id) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/admin/users/${id}`,
                config
            );

            setSelectedUser(response.data.user);
            setMessage("");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "failed to load user details"
            );
        }
    };

    const addUser = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/admin/users",
                newUser,
                config
            );

            setMessage(response.data.message);

            setNewUser({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "user"
            });

            await getUsers();
            await getDashboard();

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "failed to add user"
            );
        }
    };

    const addStore = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/admin/stores",
                {
                    name: newStore.name,
                    email: newStore.email,
                    address: newStore.address,
                    owner_id: Number(newStore.owner_id)
                },
                config
            );

            setMessage(response.data.message);

            setNewStore({
                name: "",
                email: "",
                address: "",
                owner_id: ""
            });

            await getStores();
            await getDashboard();

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "failed to add store"
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
        getDashboard();
        getUsers();
        getStores();
    }, []);

    return (
        <div className="admin-dashboard">

            <header className="admin-header">

                <div className="admin-brand">
                    <div className="admin-logo">
                        R
                    </div>

                    <div>
                        <h1>Roxiler Admin</h1>
                        <p>Rating Management System</p>
                    </div>
                </div>

                <button
                    className="admin-logout"
                    onClick={logout}
                >
                    Logout
                </button>

            </header>

            <main className="admin-content">

                {message && (
                    <div className="admin-message">
                        <span>{message}</span>

                        <button
                            onClick={() => setMessage("")}
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="welcome-section">
                    <div>
                        <h2>Admin Dashboard</h2>
                        <p>
                            Manage users, stores and ratings from one place.
                        </p>
                    </div>
                </div>

                <section className="stats-grid">

                    <div className="stat-card">
                        <div className="stat-icon blue">
                            👥
                        </div>

                        <div>
                            <span>Total Users</span>
                            <strong>
                                {dashboard.total_users ?? 0}
                            </strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">
                            🏪
                        </div>

                        <div>
                            <span>Total Stores</span>
                            <strong>
                                {dashboard.total_stores ?? 0}
                            </strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon yellow">
                            ⭐
                        </div>

                        <div>
                            <span>Total Ratings</span>
                            <strong>
                                {dashboard.total_ratings ?? 0}
                            </strong>
                        </div>
                    </div>

                </section>

                <section className="admin-card">

                    <div className="card-heading">
                        <div>
                            <h2>Add User</h2>
                            <p>
                                Create a new user, administrator or store owner.
                            </p>
                        </div>
                    </div>

                    <form
                        className="form-grid"
                        onSubmit={addUser}
                    >

                        <div className="form-field">
                            <label>Name</label>

                            <input
                                type="text"
                                placeholder="Enter full name"
                                value={newUser.name}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        name: e.target.value
                                    })
                                }
                                minLength="20"
                                maxLength="60"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="Enter email"
                                value={newUser.email}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        email: e.target.value
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Enter password"
                                value={newUser.password}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        password: e.target.value
                                    })
                                }
                                minLength="8"
                                maxLength="16"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Role</label>

                            <select
                                value={newUser.role}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        role: e.target.value
                                    })
                                }
                            >
                                <option value="user">
                                    User
                                </option>

                                <option value="admin">
                                    Admin
                                </option>

                                <option value="store_owner">
                                    Store Owner
                                </option>
                            </select>
                        </div>

                        <div className="form-field full-width">
                            <label>Address</label>

                            <input
                                type="text"
                                placeholder="Enter address"
                                value={newUser.address}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        address: e.target.value
                                    })
                                }
                                maxLength="400"
                                required
                            />
                        </div>

                        <div className="form-actions full-width">
                            <button
                                type="submit"
                                className="primary-btn"
                            >
                                + Add User
                            </button>
                        </div>

                    </form>

                </section>

                <section className="admin-card">

                    <div className="card-heading">
                        <div>
                            <h2>Users</h2>
                            <p>
                                Search, sort and view registered users.
                            </p>
                        </div>

                        <span className="count-badge">
                            {users.length} users
                        </span>
                    </div>

                    <div className="filters">

                        <input
                            type="text"
                            placeholder="Search name"
                            value={userName}
                            onChange={(e) =>
                                setUserName(e.target.value)
                            }
                        />

                        <input
                            type="text"
                            placeholder="Search email"
                            value={userEmail}
                            onChange={(e) =>
                                setUserEmail(e.target.value)
                            }
                        />

                        <input
                            type="text"
                            placeholder="Search address"
                            value={userAddress}
                            onChange={(e) =>
                                setUserAddress(e.target.value)
                            }
                        />

                        <select
                            value={userRole}
                            onChange={(e) =>
                                setUserRole(e.target.value)
                            }
                        >
                            <option value="">
                                All Roles
                            </option>

                            <option value="user">
                                User
                            </option>

                            <option value="admin">
                                Admin
                            </option>
                        </select>

                        <select
                            value={userSortBy}
                            onChange={(e) =>
                                setUserSortBy(e.target.value)
                            }
                        >
                            <option value="name">
                                Sort: Name
                            </option>

                            <option value="email">
                                Sort: Email
                            </option>

                            <option value="address">
                                Sort: Address
                            </option>

                            <option value="role">
                                Sort: Role
                            </option>
                        </select>

                        <select
                            value={userSortOrder}
                            onChange={(e) =>
                                setUserSortOrder(e.target.value)
                            }
                        >
                            <option value="asc">
                                Ascending
                            </option>

                            <option value="desc">
                                Descending
                            </option>
                        </select>

                        <button
                            className="secondary-btn"
                            onClick={getUsers}
                        >
                            Search
                        </button>

                    </div>

                    <div className="table-container">

                        <table className="admin-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="empty-row"
                                        >
                                            No users found
                                        </td>
                                    </tr>
                                ) : (

                                    users.map((user) => (

                                        <tr key={user.id}>

                                            <td>
                                                #{user.id}
                                            </td>

                                            <td>
                                                <div className="user-cell">

                                                    <div className="avatar">
                                                        {user.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {user.name}
                                                    </strong>

                                                </div>
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>
                                                <span className="address-cell">
                                                    {user.address}
                                                </span>
                                            </td>

                                            <td>

                                                <span
                                                    className={`role-badge ${user.role}`}
                                                >
                                                    {user.role ===
                                                        "store_owner"
                                                        ? "Store Owner"
                                                        : user.role}
                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="view-btn"
                                                    onClick={() =>
                                                        getUserDetails(
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

                {selectedUser && (

                    <div className="modal-overlay">

                        <div className="user-modal">

                            <div className="modal-header">
                                <div>
                                    <h2>User Details</h2>
                                    <p>
                                        Complete user information
                                    </p>
                                </div>

                                <button
                                    className="close-btn"
                                    onClick={() =>
                                        setSelectedUser(null)
                                    }
                                >
                                    ×
                                </button>
                            </div>

                            <div className="details-avatar">
                                {selectedUser.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="details-grid">

                                <div>
                                    <span>ID</span>
                                    <strong>
                                        #{selectedUser.id}
                                    </strong>
                                </div>

                                <div>
                                    <span>Name</span>
                                    <strong>
                                        {selectedUser.name}
                                    </strong>
                                </div>

                                <div>
                                    <span>Email</span>
                                    <strong>
                                        {selectedUser.email}
                                    </strong>
                                </div>

                                <div>
                                    <span>Role</span>
                                    <strong>
                                        {selectedUser.role}
                                    </strong>
                                </div>

                                <div className="detail-full">
                                    <span>Address</span>
                                    <strong>
                                        {selectedUser.address}
                                    </strong>
                                </div>

                                {selectedUser.role ===
                                    "store_owner" && (
                                        <div>
                                            <span>Rating</span>
                                            <strong className="modal-rating">
                                                ★{" "}
                                                {Number(
                                                    selectedUser.rating || 0
                                                ).toFixed(2)}
                                            </strong>
                                        </div>
                                    )}

                            </div>

                            <button
                                className="primary-btn modal-close"
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                )}

                <section className="admin-card">

                    <div className="card-heading">
                        <div>
                            <h2>Add Store</h2>
                            <p>
                                Add a store and assign it to a store owner.
                            </p>
                        </div>
                    </div>

                    <form
                        className="form-grid"
                        onSubmit={addStore}
                    >

                        <div className="form-field">
                            <label>Store Name</label>

                            <input
                                type="text"
                                placeholder="Enter store name"
                                value={newStore.name}
                                onChange={(e) =>
                                    setNewStore({
                                        ...newStore,
                                        name: e.target.value
                                    })
                                }
                                minLength="20"
                                maxLength="60"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Store Email</label>

                            <input
                                type="email"
                                placeholder="Enter store email"
                                value={newStore.email}
                                onChange={(e) =>
                                    setNewStore({
                                        ...newStore,
                                        email: e.target.value
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Store Owner ID</label>

                            <input
                                type="number"
                                placeholder="Enter owner ID"
                                value={newStore.owner_id}
                                onChange={(e) =>
                                    setNewStore({
                                        ...newStore,
                                        owner_id: e.target.value
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="form-field full-width">
                            <label>Store Address</label>

                            <input
                                type="text"
                                placeholder="Enter store address"
                                value={newStore.address}
                                onChange={(e) =>
                                    setNewStore({
                                        ...newStore,
                                        address: e.target.value
                                    })
                                }
                                maxLength="400"
                                required
                            />
                        </div>

                        <div className="form-actions full-width">

                            <button
                                type="submit"
                                className="primary-btn green-btn"
                            >
                                + Add Store
                            </button>

                        </div>

                    </form>

                </section>

                <section className="admin-card">

                    <div className="card-heading">

                        <div>
                            <h2>Stores</h2>
                            <p>
                                Search and sort registered stores.
                            </p>
                        </div>

                        <span className="count-badge">
                            {stores.length} stores
                        </span>

                    </div>

                    <div className="filters">

                        <input
                            type="text"
                            placeholder="Search store name"
                            value={storeName}
                            onChange={(e) =>
                                setStoreName(e.target.value)
                            }
                        />

                        <input
                            type="text"
                            placeholder="Search email"
                            value={storeEmail}
                            onChange={(e) =>
                                setStoreEmail(e.target.value)
                            }
                        />

                        <input
                            type="text"
                            placeholder="Search address"
                            value={storeAddress}
                            onChange={(e) =>
                                setStoreAddress(e.target.value)
                            }
                        />

                        <select
                            value={storeSortBy}
                            onChange={(e) =>
                                setStoreSortBy(e.target.value)
                            }
                        >
                            <option value="name">
                                Sort: Name
                            </option>

                            <option value="email">
                                Sort: Email
                            </option>

                            <option value="address">
                                Sort: Address
                            </option>

                            <option value="rating">
                                Sort: Rating
                            </option>
                        </select>

                        <select
                            value={storeSortOrder}
                            onChange={(e) =>
                                setStoreSortOrder(e.target.value)
                            }
                        >
                            <option value="asc">
                                Ascending
                            </option>

                            <option value="desc">
                                Descending
                            </option>
                        </select>

                        <button
                            className="secondary-btn"
                            onClick={getStores}
                        >
                            Search
                        </button>

                    </div>

                    <div className="table-container">

                        <table className="admin-table">

                            <thead>
                                <tr>
                                    <th>Store</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>

                            <tbody>

                                {stores.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="empty-row"
                                        >
                                            No stores found
                                        </td>
                                    </tr>
                                ) : (

                                    stores.map((store) => (

                                        <tr key={store.id}>

                                            <td>
                                                <div className="user-cell">

                                                    <div className="store-avatar">
                                                        🏪
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {store.name}
                                                        </strong>

                                                        <small>
                                                            Store #{store.id}
                                                        </small>
                                                    </div>

                                                </div>
                                            </td>

                                            <td>
                                                {store.email}
                                            </td>

                                            <td>
                                                <span className="address-cell">
                                                    {store.address}
                                                </span>
                                            </td>

                                            <td>

                                                <span className="rating-value">
                                                    ★{" "}
                                                    {Number(
                                                        store.rating
                                                    ).toFixed(2)}
                                                </span>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </main>

            <footer className="admin-footer">
                Roxiler Ratings Management System
            </footer>

        </div>
    );
}

export default AdminDashboard;