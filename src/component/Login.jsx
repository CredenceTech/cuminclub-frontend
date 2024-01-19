import React, { useState } from "react";
import {
    graphQLClient,
    signInMutation,
} from "../api/graphql";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required"),
});

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const validationSchema = Yup.object({
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            email: email,
            password: password
        }
        const response = await graphQLClient.request(signInMutation, formData);
        console.log(response, "Response Login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                }}
                validationSchema={LoginSchema}
                onSubmit={(values, { setSubmitting }) => {
                    console.log(values);
                    setTimeout(() => {
                        alert("Form is validated! Submitting the form...");
                        setSubmitting(false);
                    }, 1000);
                }} >
                {(props) => (
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        {!props.isSubmitting ? (
                            <>
                                <Form>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loginEmail">
                                            Email
                                        </label>
                                        <Field
                                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${props.touched.email && props.errors.email ? "is-invalid" : ""}`}
                                            id="loginEmail" name="loginEmail" type="email" placeholder="Email" value={email}
                                            onChange={ev => setEmail(ev.target.value)} />
                                        <ErrorMessage component="div" name="email" className="invalid-feedback" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loginPassword">
                                            Password
                                        </label>
                                        <Field
                                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${props.touched.password && props.errors.password ? "is-invalid" : ""}`}
                                            id="loginPassword" name="loginPassword" type="password" placeholder="Password" value={password}
                                            onChange={ev => setPassword(ev.target.value)} />
                                        <ErrorMessage component="div" name="password" className="invalid-feedback"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button disabled={props.isSubmitting}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            type="submit">
                                            {props.isSubmitting ? "Submitting..." : "Login"}
                                        </button>
                                    </div>
                                </Form>
                            </>
                        ) : (<></>)}
                    </div>
                )}
            </Formik>
        </div>
    );

    // return (
    //     <div className="min-h-screen flex items-center justify-center">
    //         <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
    //             <div className="mb-4">
    //                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loginEmail">
    //                     Email
    //                 </label>
    //                 <input
    //                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //                     id="loginEmail" name="loginEmail" type="email" placeholder="Email" value={email}
    //                     onChange={ev => setEmail(ev.target.value)} />
    //             </div>
    //             <div className="mb-4">
    //                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loginPassword">
    //                     Password
    //                 </label>
    //                 <input
    //                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //                     id="loginPassword" name="loginPassword" type="password" placeholder="Password" value={password}
    //                     onChange={ev => setPassword(ev.target.value)} />
    //             </div>
    //             <div className="flex items-center justify-between">
    //                 <button
    //                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    //                     type="submit">
    //                     Login
    //                 </button>
    //             </div>
    //         </form>
    //     </div>
    // );
};

export default Login;