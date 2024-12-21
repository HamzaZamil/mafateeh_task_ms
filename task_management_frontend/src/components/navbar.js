import axios from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = sessionStorage.getItem("authToken");
            if (token) {
                await axios.post(
                    "/logout",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            withCredentials: true,
                        },
                    }
                );
            }

            sessionStorage.removeItem("authToken");
            sessionStorage.removeItem("user_id");

            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/home">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/addTask">
                                Add Task
                            </Link>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
