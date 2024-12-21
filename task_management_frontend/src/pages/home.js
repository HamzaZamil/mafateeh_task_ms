import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import Navbar from "../components/navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { initializeCsrfToken } from '../api/axiosInstance';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/tasks'); // AxiosInstance already adds headers
            setTasks(response.data);
           
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initializeAndFetch = async () => {
            await initializeCsrfToken(); // Initialize CSRF token
            fetchTasks(); // Fetch tasks after CSRF initialization
        };
        initializeAndFetch();
    }, []);

    const filteredTasks = tasks.filter(task => {
        if (statusFilter) {
            return task.status === statusFilter;
        }
        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            await axios.delete(`/tasks/${id}`); // AxiosInstance already adds headers
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
                <h1 className="text-center">Task List</h1>
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
                            {sortedTasks.length === 0 ? (
                                <tr>
                                    <td colSpan="6">No tasks found</td>
                                </tr>
                            ) : (
                                sortedTasks.map((task, index) => (
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
