// import React, { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   graphQLClient, signInMutation,
// } from "../api/graphql";
// import { useDispatch } from 'react-redux';
// import { addCustomerAccessToken, addUserEmail } from "../state/user";
// import toast from "react-hot-toast";
// import LoadingAnimation from "./Loader";
// import { clearCartData, clearCartResponse } from "../state/cartData";
// function Login() {
//   const [loginRes, setLoginRes] = useState(null);
//   const [isError, setIsError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();


//   useEffect(() => {
//     if (loginRes?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
//       dispatch(addCustomerAccessToken(loginRes?.customerAccessTokenCreate?.customerAccessToken?.accessToken))
//       navigate("/");
//       dispatch(clearCartData());
//       dispatch(clearCartResponse())
//       toast.success('login successfully')
//     }
//   }, [loginRes])

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: Yup.object({
//       email: Yup.string()
//         .email("Invalid email format")
//         .required("Username is required"),
//       password: Yup.string()
//         .min(6, "Password must be at least 6 characters")
//         .required("Password is required"),
//     }),
//     onSubmit: async (values) => {
//       // Handle form submission, e.g., send login request
//       console.log("Submitted values:", values);
//       try {
//         setIsLoading(true);
//         const response = await graphQLClient.request(signInMutation, values);
//         setIsLoading(false);
//         if (response?.customerAccessTokenCreate?.customerUserErrors[0]?.code === "UNIDENTIFIED_CUSTOMER") {
//           setIsError("Email and password is wrong.")
//         }
//         dispatch(addUserEmail(values.email))
//         setLoginRes(response);
//       } catch (error) {
//         setIsLoading(false);
//       }

//     },
//   });

//   return (
//     <div
//       className="flex loginbackgraound relative pb-[80px]"
//     >
//       <div
//         style={{
//           width: "50%",
//         }}
//         className="hidden lg:block"
//       ></div>
//       {isLoading ?
//         <div className="" >
//           <LoadingAnimation />
//         </div> : null}
//       <div className="flex items-center flex-col justify-center flex-1 text-[#53940F]  w-full mt-2">
//         <div className="bg-[#EADEC1] w-full md:mr-[120px] mt-[120px] rounded-lg p-9">
//           <h2
//             className="font-[400] text-[37.24px] font-skillet text-[#333333] leading-[37.58px] "
//           >
//             Sign in
//           </h2>
//           <form className="flex flex-col mt-5" onSubmit={formik.handleSubmit}>
//             <div>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="Username"
//                 value={formik.values.email}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className={
//                   `border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.email && formik.errors.email
//                     ? "border-red-500"
//                     : ""
//                   }`
//                 }
//               />
//               {formik.touched.email && formik.errors.email && (
//                 <div className="text-red-500 ml-5 text-sm">{formik.errors.email}</div>
//               )}
//             </div>

//             <div className="mt-4">
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="Password"
//                 value={formik.values.password}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className={
//                   `border border-[#EFE9DA] placeholder:text-[#757575] text-[#757575] font-[400] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.password && formik.errors.password
//                     ? "border-red-500"
//                     : ""
//                   }`
//                 }
//               />
//               {formik.touched.password && formik.errors.password && (
//                 <div className="text-red-500 ml-5 text-sm">{formik.errors.password}</div>
//               )}
//             </div>
//             <div className="my-5 flex justify-between">
//               <Link to="/forgot-password" className="text-[#2A2A2A] text-[20px] font-regola-pro leading-[24px] font-[400] ">Forget Password</Link>
//               <Link to="/registration" className="text-[#2A2A2A] text-[20px] font-regola-pro leading-[24px] font-[400] ">Create an account</Link>
//             </div>


//             {isError && <div className="my-5 text-xl text-[#E91D24]">{isError}</div>}
//             <button type="submit" className="mt-10 border border-[#53940F] rounded-[15.1px] py-4 text-[40px] font-[400] px-5 bg-[#000000E8] leading-[40.36px] font-skillet text-[#FAFAFA]">
//               Sign In
//             </button>
//           </form>
//         </div>

//         {/* <button className="my-5 text-xl font-semibold underline">Forgot Password?</button> */}

//       </div>
//     </div>
//   );
// }

// export default Login;


import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { graphQLClient, registerAccountMutation, signInMutation } from "../api/graphql";
import { useDispatch } from "react-redux";
import { addCustomerAccessToken, addUserEmail } from "../state/user";
import toast from "react-hot-toast";
import LoadingAnimation from "./Loader";
import { clearCartData, clearCartResponse } from "../state/cartData";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function Login() {
  const [loginRes, setLoginRes] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginRes?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      dispatch(addCustomerAccessToken(loginRes.customerAccessTokenCreate.customerAccessToken.accessToken));
      navigate("/");
      dispatch(clearCartData());
      dispatch(clearCartResponse());
      toast.success("Login successfully");
    }
  }, [loginRes, dispatch, navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Username is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await graphQLClient.request(signInMutation, values);
        setIsLoading(false);
        if (response?.customerAccessTokenCreate?.customerUserErrors[0]?.code === "UNIDENTIFIED_CUSTOMER") {
          setIsError("Email and password is wrong.");
        }
        dispatch(addUserEmail(values.email));
        setLoginRes(response);
      } catch (error) {
        setIsLoading(false);
      }
    },
  });

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const { email, given_name, family_name } = jwtDecode(credentialResponse.credential);
    const values = {
      firstName: given_name || "",
      lastName: family_name || "",
      email,
      password: family_name,
      acceptMarketing: false,
    };

    try {
      setIsLoading(true);
      const response = await graphQLClient.request(signInMutation, { email, password: family_name });
      setIsLoading(false);
      if (response?.customerAccessTokenCreate?.customerUserErrors.length) {
        const error = response.customerAccessTokenCreate.customerUserErrors[0];
        if (error.code === "UNIDENTIFIED_CUSTOMER") {
          const registrationResponse = await graphQLClient.request(registerAccountMutation, values);
          setIsLoading(false);
          if (registrationResponse?.customerCreate?.customerUserErrors?.[0]?.message) {
            setIsError(registrationResponse.customerCreate.customerUserErrors[0].message);
            toast.error(registrationResponse.customerCreate.customerUserErrors[0].message);
          } else {
            dispatch(addUserEmail(email));
            navigate("/");
            toast.success("Registration successful! Please log in.");
          }
        } else {
          setIsError(error.message);
          toast.error(error.message);
        }
      } else {
        dispatch(addUserEmail(email));
        dispatch(addCustomerAccessToken(response.customerAccessTokenCreate.customerAccessToken.accessToken));
        navigate("/");
        toast.success("Login successful!");
      }
    } catch (error) {
      setIsLoading(false);
      setIsError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  const clientId=import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex loginbackgraound relative pb-[80px]">
        <div style={{ width: "50%" }} className="hidden lg:block"></div>
        {isLoading && (
          <div>
            <LoadingAnimation />
          </div>
        )}
        <div className="flex items-center flex-col justify-center flex-1 text-[#53940F] w-full mt-2">
          <div className="bg-[#EADEC1] w-full md:mr-[120px] mt-[120px] rounded-lg p-9">
            <h2 className="font-[400] text-[37.24px] font-skillet text-[#333333] leading-[37.58px]">Sign in</h2>
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
                  className={`border border-[#EFE9DA] font-[400] placeholder:text-[#757575] text-[#757575] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.email && formik.errors.email ? "border-red-500" : ""
                    }`}
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
                  className={`border border-[#EFE9DA] placeholder:text-[#757575] text-[#757575] font-[400] text-[20px] leading-[24px] font-regola-pro w-full focus:outline-none bg-[#EFE9DA] rounded-[15px] p-5 ${formik.touched.password && formik.errors.password ? "border-red-500" : ""
                    }`}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 ml-5 text-sm">{formik.errors.password}</div>
                )}
              </div>
              <div className="my-5 flex justify-between">
                <Link to="/forgot-password" className="text-[#2A2A2A] text-[20px] font-regola-pro leading-[24px] font-[400]">
                  Forget Password
                </Link>
                <Link to="/registration" className="text-[#2A2A2A] text-[20px] font-regola-pro leading-[24px] font-[400]">
                  Create an account
                </Link>
              </div>

              {isError && <div className="my-5 text-xl text-[#E91D24]">{isError}</div>}
              <button
                type="submit"
                className="mt-10 border border-[#53940F] rounded-[15.1px] py-4 text-[40px] font-[400] px-5 bg-[#000000E8] leading-[40.36px] font-skillet text-[#FAFAFA]"
              >
                Sign In
              </button>
            </form>

            <div className="flex flex-col justify-center items-center w-full">
           <div className="mt-[20px] flex justify-center items-center w-[300px] font-regola-pro font-[400] text-[#333333]">OR</div>
              <div className="w-[200px] mt-[20px]">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => {
                    console.log("Google login failed");
                    toast.error("Google login failed.");
                  }}
                  render={props => (
                    <button {...props} className="bg-white border border-gray-300 rounded-lg p-3 ">
                      Sign in with Google
                    </button>
                  )}
                />
              </div>
              </div>


          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
