import React, { useEffect, useState } from "react";
import {
  graphQLClient, registerAccountMutation,
} from "../api/graphql";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addUserId } from "../state/user";

function Registration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isError, setIsError] = useState("");
  const [registerRes, setRegisterRes] = useState(null);

  useEffect(() => {
    if (registerRes?.customerCreate?.customer?.id) {
      navigate("/");
      dispatch(addUserId(registerRes?.customerCreate?.customer?.id));
    }
    if (registerRes?.errors?.[0]?.message) {
      setIsError(registerRes?.errors?.[0]?.message)
    }
  }, [registerRes])

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      acceptMarketing: false,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      acceptMarketing: Yup.boolean()
        .oneOf([true], "You must accept marketing terms")
        .required("You must accept marketing terms"),
    }),
    onSubmit: async (values) => {
      setIsError("")
      const response = await graphQLClient.request(registerAccountMutation, values);
      if (response?.customerCreate?.customerUserErrors?.[0]?.message) {
        setIsError(response?.customerCreate?.customerUserErrors?.[0]?.message)
      }
      setRegisterRes(response);
    },
  });

  return (
    <div
      style={{
        display: "flex",
        height: "89.9vh",
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundImage: "url('/login_bg_img.jpg')",
          height: "89.9vh",
          width: "50%",
        }}
        className="hidden lg:block"
      ></div>
      <div className="flex items-center flex-col justify-center flex-1 text-[#53940F] bg-[#f4efea] w-full">
        <h2
          style={{ fontFamily: "Gela" }}
          className="font-bold text-2xl italic md:text-4xl lg:text-5xl text-center"
        >
          Registration
        </h2>
        <form className="flex flex-col mt-5" onSubmit={formik.handleSubmit}>
          <div className="flex gap-10 my-2 items-center justify-between">
            <label className="text-xl font-medium" htmlFor="firstName">First Name*</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter your first name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                `border border-[#53940F] focus:outline-none outline: none bg-white rounded-full focus:ring-[#53940F] py-3 px-5 ${formik.touched.firstName && formik.errors.firstName
                  ? "border-red-500"
                  : ""
                }`
              }
            />
          </div>
          <div className="flex gap-10 my-2 items-center justify-between">
            <label className="text-xl font-medium" htmlFor="lastName">Last Name*</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                `border border-[#53940F] focus:outline-none outline: none bg-white rounded-full focus:ring-[#53940F] py-3 px-5 ${formik.touched.lastName && formik.errors.lastName
                  ? "border-red-500"
                  : ""
                }`
              }
            />
          </div>
          <div className="flex gap-10 my-2 items-center justify-between">
            <label className="text-xl font-medium" htmlFor="email">Email*</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                `border border-[#53940F] focus:outline-none outline: none bg-white rounded-full focus:ring-[#53940F] py-3 px-5 ${formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : ""
                }`
              }
            />
          </div>
          <div className="flex gap-10 items-center my-2 justify-between">
            <label className="text-xl font-medium" htmlFor="password">Password*</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                `border border-[#53940F] focus:outline-none outline: none bg-white rounded-full focus:ring-[#53940F] py-3 px-5 ${formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : ""
                }`
              }
            />
          </div>
          <div className="flex items-center gap-5">
            <input
              id="acceptMarketing"
              name="acceptMarketing"
              type="checkbox"
              checked={formik.values.acceptMarketing}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-[#53940F] w-4 h-4 focus:outline-none outline: none rounded focus:ring-[#53940F] text-[#53940F] py-2 px-3"
            />
            <label className="text-xl" htmlFor="acceptMarketing">Accept Marketing</label>
          </div>
          {isError && <div className="my-5 text-xl text-[#E91D24]">{isError}</div>}
          <button type="submit" className="mt-5 border border-[#53940F] rounded-full py-2.5 text-xl px-5 bg-[#53940F] text-white">
            Register
          </button>
        </form>

        <div className="my-5 text-xl">Already have an account? <Link to="/login" className="underline font-semibold text-[#E91D24]">Login</Link></div>
      </div>
    </div>
  );
}

export default Registration;
