import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.user.role);
            localStorage.setItem("userId", response.data.user.id);

            const role = response.data.user.role;

            if (role === "admin") {
                navigate("/admin");
            } else if (role === "user") {
                navigate("/user");
            } else if (role === "store_owner") {
                navigate("/owner");
            } else {
                setMessage("invalid user role");
            }

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "login failed. please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">
                    <div className="logo-circle">
                        R
                    </div>

                    <h1>Roxiler Ratings</h1>

                    <p>
                        Sign in to continue
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleLogin}
                >

                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        className="primary-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                </form>

                {message && (
                    <div className="error-message">
                        {message}
                    </div>
                )}

                <div className="auth-footer">
                    <p>
                        Don't have an account?
                    </p>

                    <button
                        className="link-button"
                        onClick={() => navigate("/register")}
                    >
                        Create an account
                    </button>
                </div>

            </div>

        </div>
    );
}

export default Login;