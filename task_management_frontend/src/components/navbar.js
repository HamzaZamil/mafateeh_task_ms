
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

                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            withCredentials: true

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
                            <a className="nav-link active" aria-current="page" href="/home">
                                Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/addTask">
                                Add Task
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={handleLogout}>
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );
}

export default Navbar;