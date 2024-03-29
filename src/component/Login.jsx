import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import {
  graphQLClient, signInMutation,
} from "../api/graphql";
import { useDispatch } from 'react-redux';
import { addCustomerAccessToken, addUserEmail } from "../state/user";
import toast from "react-hot-toast";
import LoadingAnimation from "./Loader";
import { clearCartData, clearCartResponse } from "../state/cartData";

function Login() {
  const [loginRes, setLoginRes] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    if (loginRes?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      dispatch(addCustomerAccessToken(loginRes?.customerAccessTokenCreate?.customerAccessToken?.accessToken))
      navigate("/");
      dispatch(clearCartData());
      dispatch(clearCartResponse())
      toast.success('login successfully')
    }
  }, [loginRes])

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      // Handle form submission, e.g., send login request
      console.log("Submitted values:", values);
      try {
        setIsLoading(true);
        const response = await graphQLClient.request(signInMutation, values);
        setIsLoading(false);
        if (response?.customerAccessTokenCreate?.customerUserErrors[0]?.code === "UNIDENTIFIED_CUSTOMER") {
          setIsError("Email and password is wrong.")
        }
        dispatch(addUserEmail(values.email))
        setLoginRes(response);
      } catch (error) {
        setIsLoading(false);
      }

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
      {isLoading ?
        <div className="" >
          <LoadingAnimation />
        </div> : null}
      <div className="flex items-center flex-col justify-center flex-1 text-[#53940F] bg-[#f4efea] w-full">
        <h2
          style={{ fontFamily: "Gela" }}
          className="font-bold text-2xl italic md:text-4xl lg:text-5xl text-center"
        >
          Login
        </h2>
        <p className="mt-5 text-base md:text-xl lg:text-2xl text-center">
          Welcome back! Please enter your details.
        </p>
        <form className="flex flex-col mt-5" onSubmit={formik.handleSubmit}>
          <div className="flex gap-10 items-center justify-between">
            <label className="text-xl font-medium" htmlFor="email">Email*</label>
            <div>
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
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 ml-5 text-sm">{formik.errors.email}</div>
              )}
            </div>
          </div>

          <div className="flex gap-10 items-center mt-5 justify-between">
            <label className="text-xl font-medium" htmlFor="password">Password*</label>
            <div>
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
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 ml-5 text-sm">{formik.errors.password}</div>
              )}
            </div>
          </div>

          {isError && <div className="my-5 text-xl text-[#E91D24]">{isError}</div>}
          <button type="submit" className="mt-5 border border-[#53940F] rounded-full py-2.5 text-xl px-5 bg-[#53940F] text-white">
            Login
          </button>
        </form>

        {/* <button className="my-5 text-xl font-semibold underline">Forgot Password?</button> */}

        <div className="my-5 text-xl">Haven’t an account? <Link to="/registration" className="underline font-semibold text-[#E91D24]">Create an account</Link></div>
      </div>
    </div>
  );
}

export default Login;
