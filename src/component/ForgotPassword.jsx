import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { graphQLClient, forgotPasswordMutation } from "../api/graphql";
import toast from "react-hot-toast";
import LoadingAnimation from "./Loader";

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await graphQLClient.request(forgotPasswordMutation, {
          email: values.email,
        });
        setIsLoading(false);

        if (response?.customerRecover?.customerUserErrors.length > 0) {
          setIsError(response.customerRecover.customerUserErrors[0].message);
        } else {
          setIsSuccess("Password reset link sent successfully.");
          toast.success("Password reset link sent successfully");
        }
      } catch (error) {
        setIsLoading(false);
        setIsError("Something went wrong, please try again.");
      }
    },
  });

  return (
    <div className="flex loginbackgraound relative pb-[80px]">
      <div style={{ width: "50%" }} className="hidden lg:block"></div>
      {isLoading ? (
        <div>
          <LoadingAnimation />
        </div>
      ) : null}
      <div className="flex items-center flex-col justify-center flex-1 text-[#53940F] w-full mt-2">
        <div className="bg-[#EADEC1] w-full md:mr-[120px] mt-[120px] rounded-lg p-9">
          <h2 className="font-[400] text-[37.24px] font-skillet text-[#333333] leading-[37.58px]">
            Forgot Password
          </h2>
          <form className="flex flex-col mt-5" onSubmit={formik.handleSubmit}>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 ml-5 text-sm">
                  {formik.errors.email}
                </div>
              )}
            </div>

            {isError && <div className="my-5 text-xl text-[#E91D24]">{isError}</div>}
            {isSuccess && (
              <div className="my-5 text-xl text-[#4CAF50]">{isSuccess}</div>
            )}

            <button
              type="submit"
              className="mt-10 border border-[#53940F] rounded-[15.1px] py-4 text-[40px] font-[400] px-5 bg-[#000000E8] leading-[40.36px] font-skillet text-[#FAFAFA]"
            >
              Send Reset Link
            </button>
          </form>

          <div className="my-5 flex justify-between">
            <Link
              to="/login"
              className="text-[#2A2A2A] text-[20px] font-regola-pro leading-[24px] font-[400]"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
