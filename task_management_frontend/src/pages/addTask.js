import React from "react";
import Navbar from "../components/navbar";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddTask() {
    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            status: "",
            due_date: "",
            userId: sessionStorage.getItem("user_id"),
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .max(255, "Title must be 255 characters or less")
                .required("Title is required"),
            description: Yup.string(),
            status: Yup.string()
                .oneOf(["pending", "in progress", "completed"], "Invalid status")
                .required("Status is required"),
            due_date: Yup.date().required("Due date is required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const token = sessionStorage.getItem("authToken");
                if (!token) throw new Error("Unauthorized");

                await axios.post("/tasks", values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        withCredentials: true,
                    },
                });

                toast.success("Task added successfully!");
                resetForm();
            } catch (error) {
                console.error("Error adding task:", error.response?.data || error.message);
                toast.error("Failed to add task. Please try again.");
            }
        },
    });

    return (
        <>
            <Navbar />
            <ToastContainer />
            <div className="container mt-5">
                <h1 className="text-center mb-4" style={{ color: "#2b2d2e" }}>Add New Task</h1>
                <div className="card shadow-sm p-4" style={{ backgroundColor: "#F8F9FA" }}>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label" style={{ color: "#495057" }}>Title</label>
                            <input
                                type="text"
                                className={`form-control ${formik.touched.title && formik.errors.title ? "is-invalid" : ""}`}
                                id="title"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter task title"
                                style={{ borderColor: formik.errors.title ? "#DC3545" : "#CED4DA" }}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <div className="invalid-feedback">{formik.errors.title}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label" style={{ color: "#495057" }}>Description</label>
                            <textarea
                                className={`form-control ${formik.touched.description && formik.errors.description ? "is-invalid" : ""}`}
                                id="description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter task description"
                                rows="4"
                                style={{ borderColor: formik.errors.description ? "#DC3545" : "#CED4DA" }}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <div className="invalid-feedback">{formik.errors.description}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="status" className="form-label" style={{ color: "#495057" }}>Status</label>
                            <select
                                className={`form-select ${formik.touched.status && formik.errors.status ? "is-invalid" : ""}`}
                                id="status"
                                name="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{ borderColor: formik.errors.status ? "#DC3545" : "#CED4DA" }}
                            >
                                <option value="" disabled>Select status</option>
                                <option value="pending">Pending</option>
                                <option value="in progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            {formik.touched.status && formik.errors.status && (
                                <div className="invalid-feedback">{formik.errors.status}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="due_date" className="form-label" style={{ color: "#495057" }}>Due Date</label>
                            <input
                                type="date"
                                className={`form-control ${formik.touched.due_date && formik.errors.due_date ? "is-invalid" : ""}`}
                                id="due_date"
                                name="due_date"
                                value={formik.values.due_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{ borderColor: formik.errors.due_date ? "#DC3545" : "#CED4DA" }}
                            />
                            {formik.touched.due_date && formik.errors.due_date && (
                                <div className="invalid-feedback">{formik.errors.due_date}</div>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "#2b2d2e", borderColor: "#080808" }}>Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddTask;
