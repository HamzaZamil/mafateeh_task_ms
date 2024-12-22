import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import Navbar from "../components/navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchTasks = async () => {
        setIsLoading(true);
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            toast.error('Authorization token is missing. Redirecting to login...');
            navigate('/login'); // Redirect to login page
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get('/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error.response?.data || error.message);
            toast.error('Failed to fetch tasks. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDelete = async (e, id) => {
        e.preventDefault();

        try {
            const token = sessionStorage.getItem("authToken");
            if (!token) {
                toast.error('Authorization token is missing. Please log in.');
                return;
            }

            await axios.delete(`/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            const newTasks = tasks.filter((task) => task.id !== id);
            setTasks(newTasks);
            toast.success('Task deleted successfully');
        } catch (error) {
            console.error("Delete task failed:", error.response?.data || error.message);
            toast.error('Failed to delete task');
        }
    };

    const handleEdit = (e, id) => {
        e.preventDefault();
        navigate(`/editTask/${id}`);
    };

    return (
        <>
            <Navbar />

            <div className="container border shadow p-3 mx-auto mt-4">
                <ToastContainer />
                <h1 className="text-center">Task Management System</h1>
                <div className="d-flex justify-content-between mb-3">
                    <select
                        className="form-control w-25"
                        onChange={(e) => setStatusFilter(e.target.value)}
                        value={statusFilter}
                    >
                        <option value="">Filter by Status</option>
                        <option value="pending">Pending</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    <select
                        className="form-control w-25"
                        onChange={(e) => setSortOrder(e.target.value)}
                        value={sortOrder}
                    >
                        <option value="asc">Sort by Due Date (Ascending)</option>
                        <option value="desc">Sort by Due Date (Descending)</option>
                    </select>
                </div>

                {isLoading ? (
                    <p>Loading tasks...</p>
                ) : (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Due Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length === 0 ? (
                                <tr>
                                    <td colSpan="6">No tasks found</td>
                                </tr>
                            ) : (
                                tasks.map((task, index) => (
                                    <tr key={task.id}>
                                        <td>{index + 1}</td>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
                                        <td>{task.status}</td>
                                        <td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary mx-2"
                                                onClick={(e) => handleEdit(e, task.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={(e) => handleDelete(e, task.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default TaskList;
