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
        .required("Username is required"),
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
      className="flex loginbackgraound relative -top-[100px]"
    >
      <div
        style={{
          width: "50%",
        }}
        className="hidden lg:block"
      ></div>
      {isLoading ?
        <div className="" >
          <LoadingAnimation />
        </div> : null}
      <div className="flex items-center flex-col justify-center flex-1 text-[#53940F]  w-full">
        <div className="bg-[#EADEC1] w-full md:mr-[120px] mt-[120px] rounded-lg p-9">
          <h2
            className="font-[400] text-[37.24px] font-skillet text-[#333333] leading-[37.58px] "
          >
            Sign in
          </h2>
          <form className="flex flex-col mt-5" onSubmit={formik.handleSubmit}>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Username"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  `border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                  }`
                }
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 ml-5 text-sm">{formik.errors.email}</div>
              )}
            </div>

            <div className="mt-4">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  `border border-[#EFE9DA] placeholder:text-[#757575] text-[#757575] font-[400] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                  }`
                }
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 ml-5 text-sm">{formik.errors.password}</div>
              )}
            </div>
            <div className="my-5 flex justify-between">
              <Link to="/" className="text-[#2A2A2A] text-[20px] font-regola-pro leading-[24px] font-[400] ">Forget Password</Link>
              <Link to="/registration" className="text-[#2A2A2A] text-[20px] font-regola-pro leading-[24px] font-[400] ">Create an account</Link>
            </div>


            {isError && <div className="my-5 text-xl text-[#E91D24]">{isError}</div>}
            <button type="submit" className="mt-10 border border-[#53940F] rounded-[15.1px] py-4 text-[40px] font-[400] px-5 bg-[#000000E8] leading-[40.36px] font-skillet text-[#FAFAFA]">
              Sign In
            </button>
          </form>
        </div>

        {/* <button className="my-5 text-xl font-semibold underline">Forgot Password?</button> */}

      </div>
    </div>
  );
}

export default Login;
