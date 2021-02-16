import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button"
import styles from "./Login.module.css";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import config from "../../config";
import Form from "react-bootstrap/Form";

const Login = () => {
    const { register, handleSubmit, errors } = useForm();
    const [message, setMessage] = useState();
    const history = useHistory();

    const onSubmit = (data, e) => {
        setMessage({
            data: "Login is in progress...",
            type: "alert-warning",
        });
        fetch(`${config.baseUrl}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then(({ error, data }) => {
                setMessage({
                    data: error || "Logged in successfully, redirecting...",
                    type: error ? "alert-danger" : "alert-success",
                });

                !error &&
                    setTimeout(() => {
                        localStorage.setItem("token", data.token);
                        history.push("/dashboard");
                    }, 3000);

                !error && e.target.reset();
            });
    };

    return (
        <div
            className={`${styles.Login} container-fluid d-flex align-items-center justify-content-center`}
        >
            <div className={styles.loginFormContainer}>
                {message && (
                    <div
                        className={`alert fade show d-flex ${message.type}`}
                        role="alert"
                    >
                        {message.data}
                        <span
                            aria-hidden="true"
                            className="ml-auto cursor-pointer"
                            onClick={() => setMessage(null)}
                        >
                            &times;
            </span>
                    </div>
                )}
                <fieldset className="border p-3 rounded">
                    <legend
                        className={`${styles.loginFormLegend} border rounded p-1 text-center`}
                    >
                        Login Form
          </legend>

                    <Form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                        <Form.Group size="lg" controlId="email">
                            <Form.Label htmlFor="inputForEmail">Email address</Form.Label>
                            <span className="mandatory">*</span>
                            <Form.Control
                                id="inputForEmail"
                                name="email"
                                type="email"
                                className="form-control"
                                aria-describedby="Enter email address"
                                placeholder="Enter email address"
                                ref={register({
                                    required: {
                                        value: true,
                                        message: "Please enter your email address",
                                    },
                                })}
                            />
                            {/**
               * we provide validation configuration for email field above
               * error message are displayed with code below
               */}
                            {errors.email && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                    {errors.email.message}
                                </span>
                            )}
                        </Form.Group>
                        <Form.Group size="lg" controlId="password">
                            <Form.Label htmlFor="inputForPassword">Password</Form.Label>
                            <span className="mandatory">*</span>
                            <Form.Control
                                type="password"
                                name="password"
                                className="form-control"
                                id="inputForPassword"
                                placeholder="Enter password"
                                ref={register({
                                    required: {
                                        value: true,
                                        message: "Please enter password",
                                    },
                                })}
                            />
                            {errors.password && (
                                <span className={`${styles.errorMessage} mandatory`}>
                                    {errors.password.message}
                                </span>
                            )}
                        </Form.Group>
                        <div className="d-flex align-items-center">
                            <Button type="submit" className="btn btn-outline-primary">
                                Login
              </Button>

                            <Button className="btn btn-link ml-auto">
                                <Link to="/register">New User</Link>
                            </Button>
                        </div>
                    </Form>
                </fieldset>
            </div>
        </div>
    );
};

export default Login;
