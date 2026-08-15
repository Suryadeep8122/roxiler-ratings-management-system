import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                form
            );

            setMessage(
                response.data.message ||
                "registration successful"
            );

            setForm({
                name: "",
                email: "",
                address: "",
                password: ""
            });

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card register-card">

                <div className="auth-header">
                    <div className="logo-circle">
                        R
                    </div>

                    <h1>Create Account</h1>

                    <p>
                        Join Roxiler Ratings
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleRegister}
                >

                    <div className="form-group">
                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange}
                            minLength="20"
                            maxLength="60"
                            required
                        />

                        <small>
                            20–60 characters
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">
                            Address
                        </label>

                        <textarea
                            id="address"
                            name="address"
                            placeholder="Enter your address"
                            value={form.address}
                            onChange={handleChange}
                            maxLength="400"
                            required
                        />

                        <small>
                            Maximum 400 characters
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                            minLength="8"
                            maxLength="16"
                            required
                        />

                        <small>
                            8–16 characters with uppercase and special character
                        </small>
                    </div>

                    <button
                        className="primary-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                <div className="auth-footer">
                    <p>
                        Already have an account?
                    </p>

                    <button
                        className="link-button"
                        onClick={() => navigate("/")}
                    >
                        Sign In
                    </button>
                </div>

            </div>

        </div>
    );
}

export default Register;