import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createCustomerMutation,
  customerEmailMarketingConsentUpdateMutation,
  getCustomerByEmailQuery,
  graphQLClientAdmin,
} from "../api/graphql";
import { registerUserId } from "../state/user";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Popup = ({ onCloseButtonClick }) => {
  const userId = useSelector(registerUserId);
  const [responseData, setResponseData] = useState(null);

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
      const customerEmailParams = {
        email: values.email,
      };

      const getCustomeByEmail = await graphQLClientAdmin.request(
        getCustomerByEmailQuery,
        customerEmailParams
      );

      if (getCustomeByEmail?.customers?.edges?.length === 0) {
        const params = {
          input: {
            email: values.email,
            emailMarketingConsent: {
              marketingState: "SUBSCRIBED",
            },
          },
        };

        const response = await graphQLClientAdmin.request(
          createCustomerMutation,
          params
        );

        setResponseData(response);

        if (response.customerCreate.userErrors.length === 0) {
          onCloseButtonClick()
        }
        toast.success('Subscribed Successfully')
      } else {
        const params = {
          input: {
            customerId: getCustomeByEmail?.customers?.edges[0]?.node?.id,
            emailMarketingConsent: {
              marketingState: "SUBSCRIBED",
            },
          },
        };

        const response = await graphQLClientAdmin.request(
          customerEmailMarketingConsentUpdateMutation,
          params
        );

        setResponseData(response);
        if (response.customerEmailMarketingConsentUpdate.userErrors.length === 0) {
          onCloseButtonClick()
        }
        toast.success('Subscribed Successfully')
      }
    },
  });

  return (
    <div
      className={`fixed top-0 left-0  w-full h-full flex items-center justify-center bg-black bg-opacity-50`}
    >
      <div
        className="w-full mx-2 lg:w-4/6 h-4/6 flex relative bg-[#53940F]"
        style={{ borderRadius: "45px" }}
      >
        <button className="absolute top-3 right-5" onClick={onCloseButtonClick}>
          <img src="/close.png" className="h-6 w-6" alt="" />
        </button>
        <div
          style={{
            backgroundImage: "url('/login_bg_img.jpg')",
            width: "50%",
            borderTopLeftRadius: "42px",
            borderBottomLeftRadius: "42px",
          }}
          className="hidden lg:block ml-1 my-1"
        ></div>
        <div className="flex flex-col flex-1 items-center gap-5 justify-center text-white w-full">
          <div
            className="flex items-center lg:font-bold font-semibold text-2xl lg:text-3xl flex-col text-[#0F1035]"
            style={{ fontFamily: "Gela" }}
          >
            <div>Get 15% off your</div>
            <div>first order!</div>
          </div>

          <div className="flex items-center flex-col">
            <div>Join our club to get exclusive offers,</div>
            <div>early access to new dishes, and more!</div>
          </div>

          <form
            className="flex flex-col justify-center w-full gap-1 my-2 items-center"
            onSubmit={formik.handleSubmit}
          >
            <div className="w-full flex justify-center items-center gap-1 flex-col">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`border text-black w-4/5 border-[#53940F] focus:outline-none outline: none bg-white rounded-full focus:ring-[#53940F] py-3 px-5 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-[#D20062] w-4/5 ml-5 text-sm">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="mt-5 items-center border w-4/5 text-[#53940F] rounded-full py-2.5 text-xl px-5  bg-white"
            >
              Get My Discount
            </button>
          </form>

          <button
            className="flex justify-start flex-col"
            onClick={onCloseButtonClick}
          >
            No thanks, I hate sweet deals
          </button>

          <div className="flex text-sm lg:text-base items-center w-4/5 text-center">
            You’ll also get notified on amazing new dishes, promotional offers,
            events, and more! We pinky promise not to spam you.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
