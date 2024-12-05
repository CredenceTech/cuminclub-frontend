import React, { useEffect, useState } from "react";
import {
  graphQLClient, registerAccountMutation,
} from "../api/graphql";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addUserId } from "../state/user";
import toast from "react-hot-toast";
import LoadingAnimation from "./Loader";

function Registration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registerRes, setRegisterRes] = useState(null);

  useEffect(() => {
    if (registerRes?.customerCreate?.customer?.id) {
      navigate("/login");
      toast.success("Register successfully")
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
      //   .oneOf([true], "You must accept marketing terms")
      //   .required("You must accept marketing terms"),
    }),
    onSubmit: async (values) => {
      setIsError("")
      try {
        setIsLoading(true);
        const response = await graphQLClient.request(registerAccountMutation, values);
        setIsLoading(false);
        if (response?.customerCreate?.customerUserErrors?.[0]?.message) {
          setIsError(response?.customerCreate?.customerUserErrors?.[0]?.message)
        }
        setRegisterRes(response);
      } catch (error) {
        setIsLoading(false);
      }

    },
  });

  return (
    <div
      className="flex loginbackgraound relative pb-[80px]"
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
        <div className="flex items-center flex-col justify-center flex-1 text-[#53940F] mt-2 w-full">
        <div className="bg-[#EADEC1] w-full md:mr-[120px] mt-[120px] rounded-lg p-9">
          <h2
            className="font-[400] text-[37.24px] font-skillet text-[#333333] leading-[37.58px] "
          >
          Registration
        </h2>
        <form className="flex flex-col mt-5" onSubmit={formik.handleSubmit}>
          
            <div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  `border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.firstName && formik.errors.firstName
                    ? "border-red-500"
                    : ""
                  }`
                }
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 ml-5 text-sm">{formik.errors.firstName}</div>
              )}
            </div>
          
        
            <div className="mt-4">
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  `border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.lastName && formik.errors.lastName
                    ? "border-red-500"
                    : ""
                  }`
                }
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-500 ml-5 text-sm">{formik.errors.lastName}</div>
              )}
            </div>
        
       
            <div className="mt-4">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  `border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.firstName && formik.errors.firstName
                    ? "border-red-500"
                    : ""
                  }`
                }
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500  ml-5 text-sm">{formik.errors.email}</div>
              )}
            </div>
          
         
            <div className="mt-4">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  `border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                  }`
                }
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 ml-5 text-sm">{formik.errors.password}</div>
              )}
            </div>
        
          {/* <div className="flex items-center gap-5">
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
          </div> */}
          {isError && <div className="my-5 text-xl text-[#E91D24]">{isError}</div>}
          <button type="submit" className="mt-10 border border-[#53940F] rounded-[15.1px] py-4 text-[40px] font-[400] px-5 bg-[#000000E8] leading-[40.36px] font-skillet text-[#FAFAFA]">
            Register
          </button>
        </form>

        <div className="my-5 text-xl text-[#2A2A2A] font-regola-pro">Already have an account? <Link to="/login" className="underline font-semibold text-[#2A2A2A] font-regola-pro">Login</Link></div>
      </div>
    </div>
    </div>
  );
}

export default Registration;

