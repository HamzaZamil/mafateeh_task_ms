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
            due_date: new Date(),
            userId: sessionStorage.getItem("user_id"),
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .max(255, "Title must be 255 characters or less")
                .required("Title is required"),
            description: Yup.string().optional(),
            status: Yup.string()
                .oneOf(["pending", "in progress", "completed"], "Invalid status")
                .required("Status is required"),
            due_date: Yup.date().required("Due date is required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const token = sessionStorage.getItem("authToken");
                if (token) {
                    await axios.post(
                        "/tasks",
                        values,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                withCredentials: true,

                            },
                        }
                    );
                }
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
            <h1 className="text-center">Add Task</h1>
            <div className="container border shadow p-3 mx-auto">
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                            Title
                        </label>
                        <input
                            type="text"
                            className={`form-control ${formik.touched.title && formik.errors.title ? "is-invalid" : ""
                                }`}
                            id="title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.title && formik.errors.title && (
                            <div className="invalid-feedback">{formik.errors.title}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            className={`form-control ${formik.touched.description && formik.errors.description ? "is-invalid" : ""
                                }`}
                            id="description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.description && formik.errors.description && (
                            <div className="invalid-feedback">{formik.errors.description}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="status" className="form-label">
                            Status
                        </label>
                        <select
                            className={`form-control ${formik.touched.status && formik.errors.status ? "is-invalid" : ""
                                }`}
                            id="status"
                            name="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="" disabled>
                                Select Status
                            </option>
                            <option value="pending">Pending</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        {formik.touched.status && formik.errors.status && (
                            <div className="invalid-feedback">{formik.errors.status}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="due_date" className="form-label">
                            Due Date
                        </label>
                        <input
                            type="date"
                            className={`form-control ${formik.touched.due_date && formik.errors.due_date ? "is-invalid" : ""
                                }`}
                            id="due_date"
                            name="due_date"
                            value={formik.values.due_date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.due_date && formik.errors.due_date && (
                            <div className="invalid-feedback">{formik.errors.due_date}</div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
}

export default AddTask;
