import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import Navbar from "../components/navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './home.css'

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchTasks = async () => {
        setIsLoading(true);
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            toast.error('Authorization token is missing. Redirecting to login...');
            navigate('/login');
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
            setFilteredTasks(response.data);
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
            setFilteredTasks(newTasks);
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

    useEffect(() => {
        let updatedTasks = tasks;

        if (searchQuery) {
            updatedTasks = updatedTasks.filter(
                (task) =>
                    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter) {
            updatedTasks = updatedTasks.filter((task) => task.status === statusFilter);
        }

        updatedTasks = updatedTasks.sort((a, b) => {
            if (sortOrder === 'asc') {
                return new Date(a.due_date) - new Date(b.due_date);
            } else {
                return new Date(b.due_date) - new Date(a.due_date);
            }
        });

        setFilteredTasks(updatedTasks);
    }, [searchQuery, statusFilter, sortOrder, tasks]);

    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            width: '50px',
            cell: (row, index) => (
                <span style={{ color: '#495057', fontWeight: 'bold' }}>{index + 1}</span>
            ),
        },
        {
            name: 'Title',
            selector: (row) => row.title,
            sortable: true,
            cell: (row) => (
                <span style={{ color: '#080808', fontWeight: 'bold' }}>{row.title}</span>
            ),
        },
        {
            name: 'Description',
            selector: (row) => row.description,
            cell: (row) => (
                <span style={{ color: '#6C757D' }}>{row.description}</span>
            ),
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => (
                <span
                    style={{
                        color: row.status === 'completed' ? '#28A745' : row.status === 'in progress' ? '#FFC107' : '#DC3545',
                        fontWeight: 'bold',
                    }}
                >
                    {row.status}
                </span>
            ),
        },
        {
            name: 'Due Date',
            selector: (row) => row.due_date ? new Date(row.due_date).toLocaleDateString() : 'No due date',
            sortable: true,
            cell: (row) => (
                <span style={{ color: '#495057' }}>
                    {row.due_date ? new Date(row.due_date).toLocaleDateString() : 'No due date'}
                </span>
            ),
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div>
                    <button
                        className="btn btn-primary mx-2"
                        onClick={(e) => handleEdit(e, row.id)}
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={(e) => handleDelete(e, row.id)}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Navbar />
            <div className="container border shadow p-4 mx-auto mt-4" style={{ backgroundColor: '#F8F9FA' }}>
                <ToastContainer />
                <h1 className="text-center mb-4" style={{ color: '#2b2d2e' }}>Task Management System</h1>

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <input
                        type="text"
                        className="form-control search-box mx-2"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <select
                        className="form-control custom-dropdown mx-2"
                        onChange={(e) => setStatusFilter(e.target.value)}
                        value={statusFilter}
                    >
                        <option value="">choose your progress</option>
                        <option value="pending">Pending</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    <select
                        className="form-control custom-dropdown mx-2"
                        onChange={(e) => setSortOrder(e.target.value)}
                        value={sortOrder}
                    >
                        <option value="asc">Sort by Due Date (Ascending)</option>
                        <option value="desc">Sort by Due Date (Descending)</option>
                    </select>
                </div>

                {isLoading ? (
                    <p style={{ color: '#2b2d2e', fontWeight: 'bold' }}>Loading tasks...</p>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredTasks}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                        noHeader
                        customStyles={{
                            rows: {
                                style: {
                                    minHeight: '50px',
                                    backgroundColor: '#F8F9FA',
                                },
                            },
                            headCells: {
                                style: {
                                    backgroundColor: '#2b2d2e',
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                },
                            },
                            cells: {
                                style: {
                                    color: '#495057',
                                },
                            },
                        }}
                    />
                )}
            </div>
        </>
    );
}

export default TaskList;
